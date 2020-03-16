/* 
 * Unification of Color Empires Game - 1.0
 * 
 * 이 게임은 월경지가 매우 많은 영주국가들이 서로 분할하며 갈라지고 있었다.
 * 그러던 어느날, 한 나라가 이 쪼개진 많은 국가들을 색깔로 통일을 시도하려 한다.
 * 그 나라는 바로, 플레이어!
 * 플레이어가 한 국가를 세워서 다른 주변 국가를 정복하고 합병해나가 하나의 초대형 국가를 꿈꾸는 것이다.
 * 
 * 이 게임 방법은 간단하다.
 * 1. 처음에 국기, 국가명을 지정하고 사이즈 지정, 시작 위치를 선택한다.
 * 2. 그리고 게임을 시작한다.
 * 3. 게임 방법은 자신의 나라 (영토)색깔을 바꾸면서 주변나라의 같은 (영토)색깔을 합병하는 것이다.
 * 4. 합병해나가면서 전체를 하나의 색깔로 채워나가는 게임이다.
 * 5. 합병이 끝나면 몇번 바뀌었는지, 합병 점수를 정산하여 점수가 표시된다.
 * 
 * 
 */

/// 기본 필수 변수
// 이 변수는 국기 분할 수를 저장하는 변수
// 용도는 2개로 나누었는데, 체코형으로 바꿨다가 원래대로 돌아왔을 때, 3개가 유지되는 버그를 잡기 위함.
var divide = 3;

var ce = null;

// can't active right click to menu for relax doing a game
window.oncontextmenu = function () {
	return false;
};

// 레벨(난이도) 선택에 따라 width와 height의 값을 반환.
function selectLv(lv) {
	var attr = junctionLvSelect(lv);
	
	document.getElementById('width').value = attr.w;
	document.getElementById('height').value = attr.h;
}

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






// 게임을 시작 전 값을 초기화 시키거나, 게임도중 값을 다시 설정하려고 하거나 또는 다시 시작할 때 실행되는 함수임.
function resetting() {
	// 처음으로 돌아가게 reload하는 것이 아니라 before로 돌아가서 값을 초기화 시키도록 하는 것이다.
	
}

function resetValueInput() {
	document.getElementById('country').value = '';
}


/// before에서 game으로 넘어감.

// 게임을 시작할 때 실행되는 함수
function startNewGame() {
	// before 때 설정해둔 옵션을 읽어오고, 게임을 실행한다.
	startGame(setOption());
}
// 동일조건 다시시작할 때 실행되는 함수.
function startResumeGame() {
	startGame(saveGamePoint());	// 점수를 정산하여 저장한 다음, 게임 실행으로 넘어간다.
}

// 동일조건 게임 다시 시작하기를 눌렀거나 게임을 시작하기를 눌렀을 때 실행되는 함수의 합기점.
// 맵을 초기화시키고, attr을 읽어와 이 값대로 세팅하고 준비를 완료하면, 셀 클릭이벤트 함수를 실행하고 다음으로 넘어간다.
function startGame(option) {
	beforeDisplayOff();	// before에서 게임시작을 눌렀을 때, 디스플레이를 숨김
	afterDisplayOff();	// 동일조건 게임 다시시작을 눌렀을 때, 디스플레이를 숨김
	
	gameDisplayOn();	// 게임을 실행하면서 디스플레이를 표시.
	
	startApp(option);
	displayCountryInfo();
	
	// color cell 클릭을 감지하여 이벤트를 한꺼번에 관리하는 함수.
	eventListenerSet();
}

function startApp(option) {
	ce = new coreCE();
	
	if (ce.start(option)) {
		printMap();
	}
	
	console.log("active startApp");
}

function saveGamePoint() {
	var option = new Array(3);
	option[0] = readValueAttr();
	option[1] = 0;
	return option;
}
// before에서 설정한 옵션을 읽어와 이를 저장하고, 이 값과 초기화시킨 맵 값과 코어를 실행함수로 넘긴다.
function setOption() {
	var option = new Array(3);
	
	option[0] = readValueAttr();
	option[1] = 0;
	
	return option;
}

// before에 지정한 값을 game으로 넘기는 함수
function readValueAttr() {
	// 계획대로라면, flag의 속성을 저장할 예정이였으나 css로 저장이 되는 바람에(개꿀?) 저장할 필요가 없어짐.
	var countryName = document.querySelector('#country').value;
	var width = parseInt(document.querySelector('#width').value);
	var height = parseInt(document.querySelector('#height').value);
	var position = parseInt(document.querySelector("input[name='cp']:checked").value);
	
	return {countryName: countryName, width: width, height: height, position: position};
}

// 게일을 실행하면서 컬러 버튼을 눌러 바꾸려 할 때, 클릭을 감지하는 함수.
function eventListenerSet() {
	// 모든 셀을 한꺼번에 이벤트리스너를 관리
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
function clickActiveOperator(color) {
	var pos = ce.getCP();
	changeColorCells(pos.x, pos.y, color);
	
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

// 좌표값을 아이디 값에 적용되도록 값을 바꾼다.
function fitToNumUnit(i,n) {
	var str = "0000000000" + i;
	return str.slice(-n);
}

// 좌표값을 반환
function referenceValueLocation(x,y) {
	return ce.referenceVal(x,y);
}

// 맵 안에 있는 모든 셀의 갯수를 반환
function referenceMapCellsMax() {
	var len = ce.referenceMapLength();
	return (len.x * len.y);
}



// 맵을 출력
function printMap() {
	document.getElementById('frame').innerHTML = printColorsCell();
}

// 맵을 출력하기 위해 라인을 만들고, 각 셀마다 색깔을 지정
function printColorsCell() {
	var w = ce.getWidth(), h = ce.getHeight(), map = ce.getMap();
	var line = '<div class="map" id="map">';
	
	for (var j = 0; j < h; j++) {
		line += '<div class="map-row">';
		for (var i = 0; i < w; i++) {
			// 만약 수가 10의 단위가 아니라면 (예를 들어 1자리수라면 앞에 0을 채움)
			var id = 'id-'+fitToNumUnit(i, 2)+''+fitToNumUnit(j, 2);
			var code = numToColorCode(map[i][j]);
			
			line += '<div class="'+(code)+'" id="'+id+'">'+code+'</div>';
		}
		line += '</div>';
	}
	line += '</div>';
	
	return line;
}

// 컬러 색을 바꿀 때, cp부터 주변에 인접한 같은 색깔의 셀을 (찾아내) 같이 바꾸도록 한다.
function changeColorCells(x, y, color) {	// 인자에 있는 색깔은 숫자 값임.
	var bc = ce.referenceVal(x,y);
	cellChangeColor(x, y, color);	// 좌표 (x, y)을 
	
	// 여기서 합리적인(?) 오류를 발견했다. 할당된 메모리를 많이 먹는 주범으로 확인됨.
	// :: 분명히 같은 색임에도 불구하고 같이 색이 변하지 않는 점으로 미루어 보아 부족하다는 것으로 판단된다.
	
	for (var i = -1; i <= 1; i+=2) {
		// 맵 밖으로 나가는지(유효한 값인지) 확인
		if (ce.validCheckIndex(x,y+i)) {
			if (ce.referenceVal(x,y+i) == bc) {
//				cellChangeColor(x,y+i,color);
				changeColorCells(x,y+i,color);
			}
		}
		if (ce.validCheckIndex(x+i,y)) {
			if (ce.referenceVal(x+i,y) == bc) {
//				cellChangeColor(x+i,y,color);
				changeColorCells(x+i,y,color);
			}
		}
	}
}

function stackChange() {
	
}

// 특정 셀의 컬러를 바꿈. 여기서 반복하듯 하면 게임처럼 만들 수 있다.
function cellChangeColor(x, y, color) {	// 컬러는 소문자를 대문자로 변환 후, 숫자코드로 변환 해야 함.
	var id = 'id-'+fitToNumUnit(x, 2)+''+fitToNumUnit(y, 2);
	var cell = document.getElementById(id);
	var beforeColor = (numToColorCode(ce.setColorCell(x, y, colorCodeToNum(color))));
	
	cell.className = ""+color;
	cell.innerHTML = color;
}


// 게임의 진행도 현황을 표시하는 함수
function gameExecutionStatus() {
	var max = referenceMapCellsMax();
	var conquer = 20;
	
	document.getElementById('status-conquer').innerHTML = ''+conquer;
	
	var bar = (conquer / max) * 100;
	
	document.getElementById("progress-bar").style.width = bar + "%";
}

// game을 띄우면서 국가명, 국가 수도, 국기를 조회하여 초기화한다.
function displayCountryInfo() {
	displayInfoMax();
	displayAllScore();
	displayInfoCountryName();
	displayInfoCP();
	displayInfoFlag();
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
// 국기를 배치 (사실상 css가 다해먹어서 필요없음)
function displayInfoFlag() {
	
}
// 모든 셀의 갯수를 표시
function displayInfoMax() {
	var max = referenceMapCellsMax();
	document.getElementById('status-max').innerHTML = ''+max;
}
// 이전 기록을 표시
function displayAllScore() {
	console.log('All Score 만드셈');
	
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
function colorCodeToHEX(code) {
	var n = '#';
	
	/*
		.map-cell.z{background:#000; color:#fff;}
		.map-cell.r{background:#ff0000; color:#fff;}
		.map-cell.o{background:#ff8400; color:#fff;}
		.map-cell.y{background:#ffdd00; color:#000;}
		.map-cell.g{background:#00da26; color:#000;}
		.map-cell.s{background:#00a2ff; color:#fff;}
		.map-cell.b{background:#1900ff; color:#fff;}
		.map-cell.p{background:#a200ff; color:#fff;}
		.map-cell.w{background:#fff; color:#000;}
	*/
	
	switch(code) {
		case 'Z':
			n+='';
			break;
		case 'R':
			n+='';
			break;
		case 'O':
			n+='';
			break;
		case 'Y':
			n+='';
			break;
		case 'G':
			n+='';
			break;
		case 'S':
			n+='';
			break;
		case 'B':
			n+='';
			break;
		case 'P':
			n+='';
			break;
		case 'W':
			n+='';
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

