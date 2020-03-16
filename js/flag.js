// 이 js파일의 용도는 국기의 색깔을 지정하고, 1색기, 2색기, 3색기 옵션을 지정하면서 저장하고 바꿔주는 알고리즘임.
// 분리 사유: 코드가 길고, 핵심을 찾기 힘듬. 코드가 복잡해지는 원인을 잘라내 따로 저장하기 위함.


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
	startSetFlagColors();
	showFlag('horizon');
}

function startSetFlagColors() {
	setFlagColors(0, 'R');
	setFlagColors(1, 'G');
	setFlagColors(2, 'B');
	setFlagColors(3, 'Y');
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
			showFlagFlex(id);
			disableOffDivide();
			divideFlag(divide);
			break;
		case 'vertical':
			showFlagFlex(id);
			disableOffDivide();
			divideFlag(divide);
			break;
		case 'windows':
			showFlagFlex(id);
			disableOnDivide();
			divideFlag(4);
			break;
		case 'czech':
			showFlagBlock(id);
			disableOnDivide();
			divideFlag(3);
			break;
		case 'circle':
			showFlagBlock(id);
			disableOnDivide();
			divideFlag(2);
			break;
	}
}

function setDivideNum(num) {
	divide = num;
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
	hideColorPalette(4);
	hideAllDivideFlag();
	
	for (var i = 1; i <= num; i++) {
		showColorPalette(i);
		showDivideFlag(i-1);
	}
}

function showDivideFlag(num) {
	for (let el of document.querySelectorAll('.h'+num)) el.style.display = 'block';
	for (let el of document.querySelectorAll('.v'+num)) el.style.display = 'block';
}

function hideAllDivideFlag() {
	for (var i = 1; i <= 4; i++) {
		for (let el of document.querySelectorAll('.h'+i)) el.style.display = 'none';
		for (let el of document.querySelectorAll('.v'+i)) el.style.display = 'none';
	}
}

function setFlagColors(id, color) {	// id: 몇번째(숫자) 부분을, color 이 색으로 염색
	for (let el of document.querySelectorAll('.h'+id)) {
		el.style.background = colorSet(color);
	}
	for (let el of document.querySelectorAll('.v'+id)) {
		el.style.background = colorSet(color);
	}
	for (let el of document.querySelectorAll('.cz'+id)) {
		el.style.background = colorSet(color);
	}
	for (let el of document.querySelectorAll('.cir'+id)) {
		el.style.background = colorSet(color);
	}
	for (let el of document.querySelectorAll('.win'+id)) {
		el.style.background = colorSet(color);
	}
}

// 컬러 코드 약자를 HEX 형태로 변환하고 반환.
function colorSet(color) {
	var c = '';
	switch(color) {
		case 'Z':
			c='#000';
			break;
		case 'R':
			c='#f00';
			break;
		case 'O':
			c='#ff8400';
			break;
		case 'Y':
			c='#ffdd00';
			break;
		case 'G':
			c='#00da26';
			break;
		case 'S':
			c='#00a2ff';
			break;
		case 'B':
			c='#1900ff';
			break;
		case 'P':
			c='#a200ff';
			break;
		case 'W':
			c='#fff';
			break;
	}
	return c;
}

/*
.fc-cell.z{background:#000; color:#fff;}
.fc-cell.r{background:#ff0000; color:#fff;}
.fc-cell.o{background:#ff8400; color:#fff;}
.fc-cell.y{background:#ffdd00; color:#000;}
.fc-cell.g{background:#00da26; color:#000;}
.fc-cell.s{background:#00a2ff; color:#fff;}
.fc-cell.b{background:#1900ff; color:#fff;}
.fc-cell.p{background:#a200ff; color:#fff;}
.fc-cell.w{background:#fff; color:#000;}
*/

// mod, click disabled : 모드가 가로세로 분할형이 아니라면, 클릭을 금지
function disableOnDivide() {
	for (let el of document.querySelectorAll('.fdivi')) el.disabled = true;
}
function disableOffDivide() {
	for (let el of document.querySelectorAll('.fdivi')) el.disabled = false;
}

// show or hide color palette : 
function showColorPalette(num) {
	document.querySelector('.fc-rows:nth-child('+num+')').style.display = 'block';
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



