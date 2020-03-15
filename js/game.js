/* 
 * Unification of Color Empires Game - 1.0
 * 
 * 이 게임은 월경지가 매우 많은 영주국가들이 서로 분할하며 갈라지고 있었다.
 * 그러던 어느날, 한 나라가 이 쪼개진 많은 국가들을 색깔로 통일을 시도하려 한다.
 * 
 * 이 게임 방법은 간단하다.
 * 1. 처음에 사이즈 지정, 위치 선택과 색깔 개수를 선택한다.
 * 2. 그리고 게임을 시작한다.
 * 3. 게임 방법은 주변의 색깔로 바꾸면 그 색으로 바뀜으로 주변국가와 합병하는 것이다.
 * 4. 합병해나가면서 전체를 하나의 색깔로 채워나가는 게임이다.
 * 
 * 
 * 
 * 
 * 
 */

// can't active right click to menu for relax doing a game
window.oncontextmenu = function () {
	return false;
};


// Create Flag
function makeFlag() {
	var flag = new CreativeFlag();
	flag.setFlagFrame(1);
	flag.setFlagDivision(2);
	
}
// Creating Country Flag
var CreativeFlag = function() {
	var flagMemory = [
		1,	// 가로나눔은 0, 세로나눔은 1, 중간 원(일본형)은 2, 3은 체코형, 4는 윈도형
		2,	// 나누는 것으로는 단색은 1, 2색은 2, 3색은 3 : 3까지만 있음 (가로나눔을 몇번 나눌 것인가를 저장)/원형은 0, 체코형은 무조건 3임. 윈도형은 4임.
		[5,3],	// 색깔을 저장; 위 또는 왼쪽부터 순서대로, 나누어진 수만큼 저장. 색깔은 고유 지정값에 기인. (체코형은 왼쪽 삼각형 먼저, 그다음은 위에서부터), (윈도형은 빨초노파 순서임: 2010년생 후는 아무도 모를듯)
	];	// 색깔은 간단하다. (0:black;1:red;2:orange;3:yellow;4:green;5:skyblue;6:blue;7:puple;8:gray;9:white)
	
	this.setFlagFrame = function(set) {
		flagMemory[0] = set;
	};
	this.setFlagDivision = function(num) {
		flagMemory[1] = num;
	};
	this.selectFlagColors = function() {
		var colors = new Array(flagMemory[1].length-1);
		for (var i = 0; i < flagMemory[1].length; i++) {
			colors[i] = i;	// 사용자가 선택을 해서 비동기적으로 값을 받는다.
		}
	};
	
	this.makeFlag = function() {
		
	};
};


// Country Random Naming
function randomNamingCountry() {
	document.getElementById('country').value = namingCountry();
}
var namingCountry = function() {
	var countryMem = new NameCountryMemory();
	
	return countryMem.getCountryName();
}
// Country Naming Algorithm: function class
var NameCountryMemory = function() {
	this.COUNTRY_MEM = [
		// 0
		['', 'United', 'Empire of', 'Republic of', 'Federation of', /*'Democratic Republic of', 'Democratic People\'s Republic of', 'People\'s Republic of',*/ 'Federal Republic of', 'Kingdom of', 'State of'],
		// 1
		['', 'Central', 'Saint', 'Arab', 'the', 'South', 'North', 'West', 'East', 'New', 'Neutral Zone', 'States of'],
		// 2
		['Stropia', 'Ostripia', 'Istropia', 'Estropia', 'Ustropia', 'Astropia', 'Utopia', 'Helljoseon', 'Jarya', 'Unity', 'Sverige', 'Suomen', 'Ruski', 'Ukaina', 'Norge', 'Tuirkiye', 'Ceska', 'Slovak', 'Brackets', 'Servia', 'Estii', 'Xenon', 'Latvia', 'Maskva', 'Java', 'Electron', 'Maladez', 'Zeronimo'],
		// 3
		['', 'Islands', 'Republic', 'Federation', 'Kingdom', 'Empire', 'States']
	];
	
	this.getCountryName = function() {
		var arr = new Array(4);
		
		for (var i = 0; i < this.COUNTRY_MEM.length; i++) {
			var min = 0, max = this.COUNTRY_MEM[i].length - 1, index = 0;
			
			// 0단계에 'State of'가 채택되었다면, 1단계에서 'States of'를 제외.
			// 또한 0단계에서 'of'로 끝나면, 'States of'를 제외.
			if (i == 1 && (arr[0] == 0 || arr[0] == 1)) {
				max--;
			}
			// 0단계에 'State of'가 채택되었다면, 3단계에서 'States'를 제외.
			// 또는 0단계에서 ''와 'United'를 제외한 어떤것이든 채택되었다면, 3단계에서 ''와 'Island'만 채택.
			// 또는 1단계에서 'States of'가 채택되었다면 3단계에서 'states'를 제외한다.
			if (i == 3 && (arr[0] == (this.COUNTRY_MEM[0].length-1))) {
				max--;
			}
			if (i == 3 && (arr[0] == 0 || arr[0] == 1)) {
				max = 1;
			}
			if (i == 3 && (arr[1] == (this.COUNTRY_MEM[1].length-1))) {
				max--;
			}
			
			index = this.getRandomIntInclusive(min, max);
			
			arr[i] = index;
		}
		
		var countryName = '';
		
		for (var j = 0; j < 4; j++) {
			if ((j != 0) || (j != 3)) {
				if ((j==1) && (arr[j-1] != 0)) {
					countryName += ' ';
				}
				if ((j==2) && (arr[j-1] != 0)) {
					countryName += ' ';
				}
			}
			
			countryName += this.COUNTRY_MEM[j][arr[j]];
			
			if ((j==2) && (arr[j+1] != 0)) {
				countryName += ' ';
			}
		}
		
		return countryName;
	};
	
	this.getRandomIntInclusive = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
	};
};



// Select Level
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
			attr = {w: 50, h: 50};
			break;
	}
	return attr;
}

/*
// When the user scrolls the page, execute myFunction
window.onscroll = function() { myFunction() };

function myFunction() {
	var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	var scrolled = (winScroll / height) * 100;
	document.getElementById("myBar").style.width = scrolled + "%";
}
*/




// 이 함수는 게임을 시작하기 전에 모든걸 초기화 시키거나 게임을 처음부터 설정하려고 할 때 실행되는 함수다.
function resetting() {
	// 처음으로 돌아가게 reload하는 것이 아니라 before로 돌아가서 값을 초기화 시키도록 하는 것이다.
	allDisplayOff();
	
}

function resetValueInput() {
	document.getElementById('country').value = '';
}




function gameStart() {
	beforeDisplayOff();
	gameDisplayOn();
	
	// color cell : onclick event function
	eventListenerSet();
}

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
			console.log(color);
		}
		else {
			return;
		}
    }
    e.stopPropagation();
}

function validValueCheck(val) {
	if (val.charAt(0) == 'i' && val.charAt(1) == 'd' && val.charAt(2) == '-') {
		return true;
	}
	else {
		return false;
	}
}

// Get the modal
var modal = document.getElementById('editFlag');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openEditFlag() {
	document.getElementById('editFlag').style.display='block';
}
function closeEditFlag() {
	document.getElementById('editFlag').style.display='none';
}

function startSetFlag() {
	hideAllFlag();
	showFlag('horizon');
}

function hideAllFlag() {
	hideFlag('horizon');
	hideFlag('vertical');
	hideFlag('czech');
	hideFlag('circle');
}
function showFlag(id) {
	hideAllFlag();
	
	switch (id) {
		case 'horizon':
		case 'vertical':
		case 'windows':
			showFlagFlex(id);
			break;
		case 'czech':
		case 'circle':
			showFlagBlock(id);
			break;
	}
}
function showFlagFlex(id){
	for (let el of document.querySelectorAll('.'+id)) {
		el.style.display = 'flex';
	}
}
function showFlagBlock(id) {
	for (let el of document.querySelectorAll('.'+id)) {
		el.style.display = 'block';
	}
}
function hideFlag(id) {
	for (let el of document.querySelectorAll('.'+id)) el.style.display = 'none';
}

function divideFlag(num) {
	// 플래그 안의 갯수를 분할한다. 그전에 먼저 다 숨기고 하나씩 드러내는 것이다.
}

function changeFlagColor(id, color) {
	for (let el of document.querySelectorAll('.'+id)) el.style.background = color;
}

function showColorPalette(num) {
	hideColorPalette(4);	// 팔레트를 전부 숨기고 다시 표시하도록 한다.
	for (var i = 1; i <= num; i++) {
		document.querySelector('.fc-rows:nth-child('+i+')').style.display = 'block';
	}
}
function hideColorPalette(num) {
	for (var i = 1; i <= num; i++) {
		document.querySelector('.fc-rows:nth-child('+i+')').style.display = 'none';
	}
}
/*
.fc-rows:nth-child(1){
	display:none;
}
*/






// before, game, after의 display를 설정하는 함수
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










