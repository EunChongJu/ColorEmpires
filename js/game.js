/* 
 * Unification of Color Empires Game - 1.0
 * 
 * 이 게임은 월경지가 매우 많은 영주국가들이 서로 분할하며 갈라지고 있었다.
 * 그러던 어느날, 한 나라가 이 쪼개진 많은 국가들을 색깔로 통일을 시도하려 한다.
 * 그 나라는 바로, 플레이어가 세운 나라다!
 * 플레이어가 한 국가를 세워서 다른 주변 국가를 정복하고 합병해나가 하나의 초대형 국가를 꿈꾸는 것이다.
 * 
 * 이 게임 방법은 간단하다.
 * 1. 처음에 국기, 국가명을 지정하고 사이즈 지정, 시작 위치를 선택한다.
 * 2. 그리고 게임을 시작한다.
 * 3. 게임 방법은 자신의 나라 (영토)색깔을 바꾸면서 주변나라의 같은 (영토)색깔을 합병하는 것이다.
 * 4. 합병해나가면서 전체를 하나의 색깔로 채워나가는 게임이다.
 * 5. 합병이 끝나면 몇번 바뀌었는지, 합병 점수를 정산하여 점수가 표시된다.
 * 
 */


//// 기본 필수 변수

// 국기를 2개로 나누었는데, 체코형으로 바꿨다가 원래대로 돌아왔을 때, 3개로 바뀌는 버그를 잡기 위해 만든 변수.
var divide = 3;

// core.js의 클래스를 저장할 변수
var ce = null;

// 현재 합병 현황을 볼 수 있게 저장해놓은 지도
var filterMap = null;

// 현재 게임 횟수
var count = 0;
// 이전 턴 점령 갯수
var beforeStep = 0;

// 클릭을 가능하게 함
var clickValidity = true;

// 보너스 기록
var bonusArr = null;



//// 무언가의 필수임. :: core.js의 부담을 덜기 위해(호출을 줄이기 위해) 사용.

// 우클릭해서 시야를 가리는 것을 막아놓음.
window.oncontextmenu = function () {
	return false;
};

// 인덱스 유효성 검사
function validCheckIndex(x,y) {
	var w = getWidth(), h = getHeight();
	
	var widthValid = !((x < 0) || (x >= w));	// 그중에 하나라도 벗어난다면 false
	var heightValid = !((y < 0) || (y >= h));	// 그중에 하나라도 벗어난다면 false
	
	return (widthValid && heightValid);	// 둘다 벗어나지 않는다면, true
}

// Width 조회
function getWidth() {
	return document.getElementById('width').value;
}

// Height 조회
function getHeight() {
	return document.getElementById('height').value;
}


//// 레벨 선택 - before

// 레벨(난이도) 선택에 따라 width와 height의 값을 반환.
function selectLv(lv) {
	var attr = junctionLvSelect(lv);
	document.getElementById('width').value = attr.w;
	document.getElementById('height').value = attr.h;
}

// 레벨에 따른 분기점, 레벨에 따라 w, h가 달라짐.
function junctionLvSelect(lv) {
	var attr;
	switch (lv) {
		case 1:
			attr = {w: 5, h: 5};
			break;
		case 2:
			attr = {w: 21, h: 21};
			break;
		case 3:
			attr = {w: 50, h: 25};
			break;
	}
	return attr;
}


//// game으로

// 게임을 다시 시작하거나 게임을 시작할 때 실행되는 함수
function startGame() {
	startApp(setOption());	// 옵션을 생성하고, core 클래스를 생성함.
	
	beforeDisplayOff();	// before 디스플레이를 숨김
	afterDisplayOff();	// after 디스플레이를 숨김
	gameDisplayOn();	// game 디스플레이를 표시.
	
	displayCountryInfo();	// 국가 설정을 표시
	
//	startApp(option);
	
	// color cell 클릭을 감지하여 이벤트를 한꺼번에 관리하는 함수.
	eventListenerSet();
}
// 옵션을 세팅.
function setOption() {
	var option = new Array(3);
	option[0] = readValueAttr();
	option[1] = 0;	// <- 이거는 모르겠다. 점수 저장은 세션에 읽어오면 되니까
	return option;
}

// before에 지정한 값을 읽고 리턴.
function readValueAttr() {
	var countryName = document.querySelector('#country').value;
	var width = parseInt(document.querySelector('#width').value);
	var height = parseInt(document.querySelector('#height').value);
	var position = parseInt(document.querySelector("input[name='cp']:checked").value);
	return {countryName: countryName, width: width, height: height, position: position};
}

// 게임을 시작함으로 클래스를 생성하고 맵을 표시
function startApp(option) {
	ce = new coreCE();
	
	count = 0;
	beforeStep = 0;
	bonusArr = new Array();
	
	if (ce.start(option)) {
		printMap();
	}
	ce.setPoint(0);
}

// game을 띄우면서 국가명, 국가 수도, 국기를 조회하여 초기화한다.
function displayCountryInfo() {
	displayInfoMax();	// 셀의 최대 갯수 표시
	
	displayInfoCountryName();	// 국가명을 표시
	
	displayInfoCP();	// CP (Capital Position)을 표시: 시작점 표시
	
	gameExecutionStatus(1); // 시작하는 곳이 z이므로 1이 맞음.
}



//// 클릭 이벤트

// 게임을 실행하면서 컬러버튼 클릭을 감지하기 위해 동시에 관리하는 함수.
function eventListenerSet() {
	var allColors = document.querySelector("#colors");
	allColors.addEventListener("mousedown", colorClickActive, false);
}

// 모든 셀을 통틀어 클릭을 감지하는 함수
function colorClickActive(e) {
    if (e.target !== e.currentTarget) {
        var color = e.target.id;
		if (validValueCheck(color) && clickValidity) {
			clickActiveOperator(color);	// 클릭이 확인되면, 컬러를 바꾸고, 점령지 갯수를 계산하고 표시한다.
		}
		else {
			return;	// 유효하지 않은 값이야? 안돼 돌아가, 바꿔줄 생각 없어
		}
    }
    e.stopPropagation();
}

// 버튼 클릭시, 컬러를 바꾸고 점령지 갯수를 계산하여 디스플레이에 표시한다.
function clickActiveOperator(c) {
	var color = colorCodeToNum(c);	// 캐릭터형인 c를 숫자 color로 변환
	
	activeFindAndChangeColor(color);
	
	ce.clickCellActive(color);	// 점령지 수를 계산
	
	// 그리고 여기서는 정산하고 포인트를 표시하는 동시에 통일여부를 검사한다.
	if (gameExecutionStatus(ce.getConquer())) {	// 통일되었다면
		disableColorsBtn();		// 컬러버튼을 못 누르게 만든다.
		
		setTimeout(function() {
			afterActive(true);
		}, 3000);
	}
	else {	// 아직 통일안되었다면
		// 넘어가 (뭐 구현할거 없으면 else 구문은 필요 없음)
	}
}

function disableColorsBtn() {	// 컬러버튼을 못누르게 만듬. 그리고 클릭감지를 해제.
	clickValidity = false;
}
function enableColorsBtn() {	// 컬러버튼을 누를 수 있도록 클릭감지를 해제.
	clickValidity = true;
}

// 컬러 버튼 클릭시, 아이디 값 유효성을 검사.
function validValueCheck(val) {
	if (val.charAt(0) == 'R' || val.charAt(0) == 'O' || val.charAt(0) == 'Y' || val.charAt(0) == 'G' || val.charAt(0) == 'S' || val.charAt(0) == 'B' || val.charAt(0) == 'P' || val.charAt(0) == 'W' || val.charAt(0) == 'Z') {
		return true;
	}
	else {
		return false;
	}
}


//// 바꿔바꿔~ (중국어 아님)

// 좌표값을 아이디 값에 적용되도록 값을 바꾼다.
function fitToNumUnit(i,n) {
	var str = "0000000000" + i;
	return str.slice(-n);
}

// 좌표값을 아이디로 바꿈
function convertValToID(x,y) {
	return ('id-'+fitToNumUnit(x, 2)+''+fitToNumUnit(y, 2));
}

// 맵 안에 있는 모든 셀의 갯수를 반환
function referenceMapCellsMax() {
	var len = ce.referenceMapLength();
	return (len.x * len.y);
}


//// 맵을 표시

// 맵을 출력하는데 필요한 라인을 받아 출력
function printMap() {
	document.getElementById('frame').innerHTML = printColorsCell();
}

// 맵을 출력하는데 필요한 라인을 제조하고, 각 셀마다 맵 값에 따른 색깔을 지정.
function printColorsCell() {
	var w = getWidth(), h = getHeight(), map = ce.getMap();
	var line = '<div class="map" id="map">';
	for (var j = 0; j < h; j++) {
		line += '<div class="map-row">';
		for (var i = 0; i < w; i++) {
			var id = convertValToID(i,j);
			var code = numToColorCode(map[i][j]);
			line += '<div class="'+(code)+'" id="'+id+'">'+code+'</div>';
		}
		line += '</div>';
	}
	line += '</div>';
	return line;
}


//// 이벤트에 의한 색깔 변경

// 여기 모든 함수가 재귀적 함수를 이용해서 가동하는데, 이걸 반복으로 바꾸어야 한다.

function activeFindAndChangeColor(color) {	// 파라미터의 color은 숫자 타입임.
	// 파라미터의 color은 바꿀 색이고
	// posC는 찾을 색이다.
	filterMap = ce.getMap();
//	fQueue = new Queue();
	var pos = ce.getCP();
	var x = pos.x, y = pos.y;
	var posC = filterMap[x][y];
	
//	console.log(posC +" -> "+ color);
	changeColorQ(x,y,posC);	// 바뀔 색깔(예를 들어 시작점에서는 Z를 찾는 것)을 찾아 -1로 바꾼다.
	
	mergeSameColorMap(color);	// -1을 찾아 색깔을 바꾼다. 그리고, 점령지 수를 반환받는다.
	
	ce.saveMap(filterMap);		// 맵을 저장한다.
}

// -1의 의미는 현재 검사에서 이 곳은 딴 애가 '이미 검사했으니 알아서 피해가~'라는 의미다.
// 검사를 마치고 나면, saveMap()을 이용해 -1을 모두 합병 후의 색깔로 바뀌어야 다음 검사에서 검사가 가능하다.
// 또한, 큐도 스타일 지정이 완료되고 나면, 초기화하여 비운다.
function changeColorQ(x,y,c) {	// parameter is Number type. 그 컬러가 바뀔 색깔을 찾는 것이다.
	filterMap[x][y] = -1;
	for (var i = -1; i <= 1; i+=2) {
		for (var j = -1; j <= 1; j+=2) {
			var posX = x, posY = y;
			if (validCheckIndex((x), (y + j))) {	// 맵 밖으로 벗어나지 않아야 함.
				posX = x, posY = y+j;
				if (filterMap != -1) {	// -1이면 이미 탐색한 구간이 되므로, 비탐색 구간을 찾는다.
					if (filterMap[posX][posY] == c) {	// 합병하려는 컬러 값을 찾는다.
						changeColorQ(posX,posY,c);	// 그리고 그 자리의 주변 탐색을 실행.
					}
				}
			}
			if (validCheckIndex((x + i), (y))) {	// 맵 밖으로 벗어나지 않아야 함.
				posX = x+i, posY = y;
				if (filterMap != -1) {	// -1이면 이미 탐색한 구간이 되므로, 비탐색 구간을 찾는다.
					if (filterMap[posX][posY] == c) {	// 합병하려는 컬러 값을 찾는다.
						changeColorQ(posX,posY,c);	// 그리고 그 자리의 주변 탐색을 실행.
					}
				}
			}
		}
	}
//	console.dir(filterMap);
}

function mergeColorCell(x,y,c) {
	var cell = document.getElementById(convertValToID(x,y));
	var color = numToColorCode(c);
	cell.className = ""+color;
	cell.innerHTML = color;
}

// 맵의 모든 -1의 값을 하나의 색깔로 저장합니다: 합병되었다고 하면 될듯.
function mergeSameColorMap(color) {	// 파라미터는 숫자형.
	for (var i = 0; i < getWidth(); i++) {
		for (var j = 0; j < getHeight(); j++) {
			if (filterMap[i][j] == -1) {
				filterMap[i][j] = color;
				mergeColorCell(i,j,color);
			}
		}
	}
}


//// 뭔가를 표시하는 모임

// 게임의 진행도 현황과 포인트를 표시하는 함수
function gameExecutionStatus(conquer) {
	var uni = false;
	var max = referenceMapCellsMax();
	document.getElementById('status-conquer').innerHTML = ''+conquer;
	
	var bar = (conquer / max) * 100;
	document.getElementById("progress-bar").style.width = bar + "%";
	
	count++;	// 카운트 증가
	settlePoint(conquer);	// 점령지 수 등에 의한 포인트 갱신
	
	beforeStep = conquer;	// 정산 후, 이전 점령지수에 저장
	return unificationCheck(conquer);	// 완전통일 여부를 검사하고 반환; 위에서 after를 처리할 것임.
}

// 포인트를 정산하면서 디스플레이에 표시
function settlePoint(conquer) {
	var point = ce.getPoint();	// 처음에는 0이다. 그러나 점령지 갯수와 횟수에 따라 점수가 달라진다.
	var bonus = 0;	// 보너스는 더해가는 것이다.
	
	var max = referenceMapCellsMax();	// 셀의 전체 갯수
	var stepGap = conquer - beforeStep;	// 이전 스텝의 점령지수와 현재 점령지수의 갭. (부정행위 근절)
	var remaining = max - conquer;
	
//	console.log('bonus : ' + bonus);
	
	// 보너스 계산 : 카운트가 길어질수록 더해지는 수가 줄어든다.
	bonus += parseInt((count - 1) * remaining * stepGap * 0.001);
	
	// 포인트 계산
	point += stepGap + bonus;
	
	document.getElementById('point').innerHTML = '' + point;
	document.getElementById('bonus').innerHTML = '' + bonus;
	document.getElementById('count').innerHTML = '' + count;
	document.getElementById('remaining').innerHTML = '' + remaining;
	
	ce.setPoint(point);	// 포인트를 갱신
	bonusArr.push(bonus);	// 보너스 기록 저장
}


// Country Name을 표시
function displayInfoCountryName() {
	var cn = ce.getCountryName();
	document.getElementById('cn').innerHTML = ''+cn;
}

// 국가수도 위치를 배치
function displayInfoCP() {
	var cp = ce.getCapitalPosition();
	document.getElementById('capitalPos').innerHTML = ''+cp;
}

// 모든 셀의 갯수를 표시
function displayInfoMax() {
	var max = referenceMapCellsMax();
	document.getElementById('status-max').innerHTML = ''+max;
}

// 이전 기록을 표시
function displayAllScore() {
	console.log('All Score나 만드셈');
}

// 완전 통일 검사
function unificationCheck(conquer) {
	var all = getWidth() * getHeight();
	return ((all == conquer) ? true : false);
}


/* 
 * 컬러 - 숫자 값 대조표 ::
 * 0: Z
 * 1: R
 * 2: O
 * 3: Y
 * 4: G
 * 5: S
 * 6: B
 * 7: P
 * 8: W
 */
// 숫자를 컬러로 변환
function numToColorCode(n) {
	var code;
	switch(n) {
		case 0:
			code = 'Z';
			break;
		case 1:
			code = 'R';
			break;
		case 2:
			code = 'O';
			break;
		case 3:
			code = 'Y';
			break;
		case 4:
			code = 'G';
			break;
		case 5:
			code = 'S';
			break;
		case 6:
			code = 'B';
			break;
		case 7:
			code = 'P';
			break;
		case 8:
			code = 'W';
			break;
	}
	return code;
}
function colorCodeToNum(code) {
	var n;
	switch(code) {
		case 'Z':
			n = 0;
			break;
		case 'R':
			n = 1;
			break;
		case 'O':
			n = 2;
			break;
		case 'Y':
			n = 3;
			break;
		case 'G':
			n = 4;
			break;
		case 'S':
			n = 5;
			break;
		case 'B':
			n = 6;
			break;
		case 'P':
			n = 7;
			break;
		case 'W':
			n = 8;
			break;
	}
	return n;
}
// before, game, after의 display를 설정하는 함수 (디스플레이를 궅이 style.display 입력을 할 필요 없음)
function beforeDisplayOff() {
	document.getElementById('before').style.display = 'none';
}
function gameDisplayOff() {
	document.getElementById('game').style.display = 'none';
}
function afterDisplayOff() {
	document.getElementById('after').style.display = 'none';
}
function beforeDisplayOn() {
	document.getElementById('before').style.display = 'block';
}
function gameDisplayOn() {
	document.getElementById('game').style.display = 'block';
}
function afterDisplayOn() {
	document.getElementById('after').style.display = 'block';
}
function allDisplayOff() {
	beforeDisplayOff();
	gameDisplayOff();
	afterDisplayOff();
}
function callAlertDistroy(tmp) {
	if (tmp) {
		return;
	}
}



// 중도퇴장 여부
function showQExit() {
	document.getElementById('exit').style.display = 'block';
}
function hideQExit() {
	document.getElementById('exit').style.display = 'none';
}
// 게임 엑시트 강행
function exitGame() {
	// 게임 중도퇴장에 의한 모든 시스템을 다시 정비하든가 해야 함. (하지만 그딴거 없다. after가 처리함)
	
	// 중도퇴장 시 포인트는 인정 못받으며(기록되지도 못함), 그래프 창을 보고 게임 다시하기 여부를 묻게 된다.
	
	afterActive(false);
}




// 완전히 통일되었을 때, 또는 게임 중도퇴장시 발생하는 이벤트의 중앙시스템
function afterActive(uni) {	//
	// 디스플레이 조정
	gameDisplayOff();
	afterDisplayOn();
	
	// 애프터 서비스(?)를 띄움
	if (uni) {	// 통일된것이 확실할때
		openCongratEvent();
	}
	else {	// 중도퇴장한 것으로 드러날때
		openExitEvent();
	}
}



// 축하한다는 메세지를 띄움, 그리고 국기, 국가명, 수도, 카운트, 점수 등을 보여준다.
function openCongratEvent() {
	document.getElementById('congrat').style.display = 'block';
	
}
// 축하메세지 닫기 또는 다음 버튼을 누름
function closeCongratEvent() {
	document.getElementById('congrat').style.display = 'none';
	showGraph();
	showAnalysisGraph();
}

// 중도퇴장시, 띄우는 것.
function openExitEvent() {
	document.getElementById('exitModal').style.display = 'block';
}
// 중도 퇴장에 대해 모달 창을 닫으려 할 때
function closeExitEvent() {
	document.getElementById('exitModal').style.display = 'none';
	showQAgain();
}

// congrat 창을 닫으면 다음으로 분석표를 띄운다.
function showAnalysisGraph() {
	document.getElementById('analysis').style.display = 'block';
	activeAnalyzing();	// activeAnalyzing()을 실행하고 graph를 띄운다.
}
// 분석표를 닫으면 발생하는 이벤트
function closeAnalysisGraph() {
	document.getElementById('analysis').style.display = 'none';
	showQAgain();
	
	// 또 무언가의 그게 있음.
	// 그것은 바로 분석창을 종료한다는 것이다.
}

// 게임 다시하기 여부 창을 띄운다.
function showQAgain() {
	document.getElementById('gameAgain').style.display = 'block';
}
//어떤 버튼을 누르건 여부 창이 닫히게 되고 나머지는 각자 함수가 알아서 처리한다.
function hideQAgain() {
	document.getElementById('gameAgain').style.display = 'none';
}

// 보너스 기록을 리턴
function getArrayOfBonus() {
	return bonusArr;
}

//{
// playNewGame()은 core를 종료시키고 input을 초기화한다.

// playSameGame()은 core를 종료하기 전에 옵션을 받아두고 core를 삭제 후, input을 초기화하지 않고 before로 돌아감.

// gameOver()는 core를 종료절차를 밟아 종료한다음, exit를 하도록 한다. 만약 안된다면, 알아서 닫으라는 팝업창을 띄운다.
//}

// 새로운 게임으로 다시하기
function playNewGame() {
	hideQAgain();	// 새로운 게임으로 누르게 되면, 옵션을 삭제하고, core를 초기하하고, input의 모든 값을 초기화시킨다.
	systemShutDown();
	
	location.reload();	// 그냥 리로드하는게 제일 빠르다.
}

function resetForm() {
	location.reload();
}

// 동일한 옵션으로 다시하기
function playSameGame() {
	hideQAgain();	// 동일한 옴션을 누르게 되면, core를 초기하하되 옵션을 삭제하지 않는다.
	systemShutDown();
	
	resetting();
	
	afterDisplayOff();	// 그냥 before로 돌아가는게 제일 빠르다.
	beforeDisplayOn();
}

// 종료하기
function gameOver() {
	hideQAgain();	// 종료를 누르게 되면, 모든 함수들과 core 같은 모든 시스템을 종료시키고, 윈도를 벗어난다.
	systemShutDown();
	
	closeWindow();
}

// 옵션을 없애는 방법은 간단하다. 바로 core를 null로 바꾸면 생성자가 없어지고, 옵션도 없어지는거다!
// 이 절차를 수행하는 함수인 deleteCore()를 실행하기 전에 반드시 종료절차라는 함수를 실행해야 한다.
// 시스템 종료 : 컴퓨터를 종료시키는게 아니라 core의 시스템을 종료시킨사는 것이다.
function systemShutDown() {
	ce.shutDown();	// core에게 스스로 종료하도록 명령을 내림.
	
	deleteCore();	// core를 null로 바꿈으로 시스템이 종료되었다고 할 수 있다.
}

// Play same board를 눌렀을 때, 초기화해야하는 것만 실행
function resetting() {
	count = 0;			// 현재 몇 턴인지 표시하는 것을 초기화
	
	bonusArr = null;	// 보너스 기록을 초기화
	
	beforeStep = 0;		// 이전 기록을 초기화
	
	filterMap = null;	// 필터 맵을 초기화
	
	enableColorsBtn();	// 클릭을 가능하게 함
	
	clearGraphIndex();	// 그래프 인덱스번호를 초기화
}

// core를 null로 바꿈으로 삭제
function deleteCore() {
	if (ce = null) {
		return true;
	}
	else {
		return false;
	}
}

function closeWindow() {
	self.opener = self;
	window.close();
}






