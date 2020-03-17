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
// 점령지 수를 계산
var conquerCell = 0;
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
//// 게임을 다시 시작
// 게임 시작 전에 값을 초기화 시키거나, 게임도중 값을 다시 설정하려고 하거나 또는 다시 시작할 때 실행되는 함수.
function resetting() {
	// 처음으로 돌아가게 reload하는 것이 아니라 before로 돌아가서 값을 초기화 시키도록 하는 것이다.	
}
// 리셋을 눌렀을 때 모든 input과 국기를 초기화시킴
function resetValueInput() {
	document.getElementById('country').value = '';
}
//// game으로
// 게임을 디시 시작하거나 게임을 시작할 때 실행되는 함수
function startGame() {
	var option = setOption();	// 옵션을 생성.
	beforeDisplayOff();	// before 디스플레이를 숨김
	afterDisplayOff();	// after 디스플레이를 숨김
	gameDisplayOn();	// game 디스플레이를 표시.
	startApp(option);	// core 클래스를 생성
	displayCountryInfo();	// 국가 설정을 표시
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
	if (ce.start(option))
		printMap();
}
// game을 띄우면서 국가명, 국가 수도, 국기를 조회하여 초기화한다.
function displayCountryInfo() {
	displayInfoMax();	// 셀의 최대 갯수 표시
	displayAllScore();	// ???
	displayInfoCountryName();	// 국가명을 표시
	displayInfoCP();	// CP (Capital Position)을 표시: 시작점 표시
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
		if (validValueCheck(color)) {
			clickActiveOperator(color);
		}
		else {
			return;
		}
    }
    e.stopPropagation();
}
// 버튼 클릭시, 실행될 메소드를 전부 호출
function clickActiveOperator(c) {
	var color = colorCodeToNum(c);
	/*
	var pos = ce.getCP();
	changeColorCells(pos.x, pos.y, color);
	*/
	activeFindAndChangeColor(color);
	gameExecutionStatus();
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
// 좌표값에 위치한 값을 반환
function referenceValueLocation(x,y) {
	return ce.referenceVal(x,y);
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
/*
//// 이벤트에 의한 색깔을 변경
// 컬러 색을 바꿀 때, cp부터 주변에 인접한 같은 색깔의 셀을 (찾아내) 같이 바꾸도록 한다.
function changeColorCells(x, y, color) {	// 인자에 있는 색깔은 숫자 값임.
	var bc = ce.referenceVal(x,y);
	cellChangeColor(x, y, color);	// 좌표 (x, y)을 
	// 여기서 합리적인(?) 오류를 발견했다. 할당된 메모리를 많이 먹는 주범으로 확인됨.
	// :: 분명히 같은 색임에도 불구하고 같이 색이 변하지 않는 점으로 미루어 보아 부족하다는 것으로 판단된다.
	for (var i = -1; i <= 1; i+=2) {
		// 맵 밖으로 나가는지(유효한 값인지) 확인
		if (validCheckIndex(x,y+i)) {
			if (ce.referenceVal(x,y+i) == bc) {
//				cellChangeColor(x,y+i,color);
				changeColorCells(x,y+i,color);
			}
		}
		if (validCheckIndex(x+i,y)) {
			if (ce.referenceVal(x+i,y) == bc) {
//				cellChangeColor(x+i,y,color);
				changeColorCells(x+i,y,color);
			}
		}
	}
}
// 특정 셀의 컬러를 바꿈. 여기서 반복하듯 하면 게임처럼 만들 수 있다.
function cellChangeColor(x, y, color) {
	var id = convertValToID(x,y);
	var cell = document.getElementById(id);
	var beforeColor = (numToColorCode(ce.setColorCell(x, y, colorCodeToNum(color))));
	cell.className = ""+color;
	cell.innerHTML = color;
}
*/
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
	console.log(posC +" -> "+ color);
	changeColorQ(x,y,posC);	// 바뀔 색깔(예를 들어 시작점에서는 Z를 찾는 것)을 찾아 -1로 바꾼다.
	mergeSameColorMap(color);	// -1을 찾아 색깔을 바꾼다.
	ce.saveMap(filterMap);		// 맵을 저장한다.
}
// -1의 의미는 현재 검사에서 이 곳은 딴 애가 '이미 검사했으니 알아서 피해가~'라는 의미다.
// 검사를 마치고 나면, saveMap()을 이용해 -1을 모두 합병 후의 색깔로 바뀌어야 다음 검사에서 검사가 가능하다.
// 또한, 큐도 스타일 지정이 완료되고 나면, 초기화하여 비운다.
function changeColorQ(x,y,c) {	// parameter is Number type. 그 컬러가 바뀔 색깔을 찾는 것이다.
	filterMap[x][y] = -1;
	for (var i = -1; i <= 1; i+=2) {
		for (var j = -1; j <= 1; j+=2) {
			if (validCheckIndex((x), (y + j))) {	// 맵 밖으로 벗어나지 않아야 함.
				var posX = x, posY = y+j;
				if (filterMap != -1) {	// -1이면 이미 탐색한 구간이 되므로, 비탐색 구간을 찾는다.
					if (filterMap[posX][posY] == c) {	// 합병하려는 컬러 값을 찾는다.
						changeColorQ(posX,posY,c);	// 그리고 그 자리의 주변 탐색을 실행.
					}
				}
			}
			if (validCheckIndex((x + i), (y))) {	// 맵 밖으로 벗어나지 않아야 함.
				var posX = x+i, posY = y;
				if (filterMap != -1) {	// -1이면 이미 탐색한 구간이 되므로, 비탐색 구간을 찾는다.
					if (filterMap[posX][posY] == c) {	// 합병하려는 컬러 값을 찾는다.
						changeColorQ(posX,posY,c);	// 그리고 그 자리의 주변 탐색을 실행.
					}
				}
			}
		}
	}
	console.dir(filterMap);
}
/*
function nullExpansion(x,y) {
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (md2.indexValueValid((x + i), (y + j))) {
				if (md2.map[x+i][y+j] != -2) {
					var posX = x+i, posY = y+j;
					var id = "c" + fitToNumUnit(posX, 2) + fitToNumUnit(posY, 2);
					var cell = document.getElementById(id);
					var value = md2.map[posX][posY];
					if (value > 0) {
						cell.innerHTML = '' + value;
						showNumber(cell, value);
						md2.map[posX][posY] = -2;
					}
					else {
						md2.map[posX][posY] = -2;
						nullExpansion(posX,posY);
					}
					cell.style.backgroundColor = 'white';
					cell.disabled = true;
				}
			}
		}
	}
}
*/
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
			// ERROR
			if (filterMap[i][j] == -1) {
				filterMap[i][j] = color;
				mergeColorCell(i,j,color);
			}
		}
	}
}
//// 뭔가를 표시하는 모임
// 게임의 진행도 현황을 표시하는 함수
function gameExecutionStatus() {
	var max = referenceMapCellsMax();
	var conquer = 20;
	document.getElementById('status-conquer').innerHTML = ''+conquer;
	var bar = (conquer / max) * 100;
	document.getElementById("progress-bar").style.width = bar + "%";
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
