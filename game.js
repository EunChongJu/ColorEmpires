





// 받은 인자를 통해 만들어서 생성된 지뢰 맵을 디스플레이에 표시된다.
function showMapGameCell(w,h) {
	var line = '<div class="gt" id="gt">';
	
	for (var j = 0; j < h; j++) {
		line += '<div class="gt-row">';
		for (var i = 0; i < w; i++) {
			// 만약 수가 10의 단위가 아니라면 (예를 들어 1자리수라면 앞에 0을 채움)
			var x = fitToNumUnit(i, 2);
			var y = fitToNumUnit(j, 2);
			
			line += '<button class="gt-cell" id="c' + x + y + '"></button>';
		}
		line += '</div>';
	}
	line += '</div>';
	
	return line;
}


function all(){
	// 모든 컬러 버튼을 한꺼번에 이벤트리스너를 관리
	var allColorBtn = document.querySelector("#colorBar");
	allColorBtn.addEventListener("mousedown", cellClickActive, false);
}

// 우측 클릭 방지 : 기본값 : 게임에 집중하기 위함
window.oncontextmenu = function () {
	return false;
};

// 모든 셀을 통틀어 클릭을 감지하는 함수
function colorActive(e) {
    if (e.target !== e.currentTarget) {
        var color = e.target.id;
		
		// 앞에 'c_'가 붙지 않은 아이디 값을 걸러낸다. (컬러 버튼 아이디는 'c_'로 시작하고 맵은 'c'로 시작, 구분을 위함)
		if (color.charAt(0) == 'c' && color.charAt(1) == '_') {
			
			if (e.button == 0) {	// 좌클릭
				
			}
			else {
				return;
			}
		}
    }
    e.stopPropagation();
}




// TEST ZONE
var color = ['red','orange','yellow',]



var ce = new CE();
ce.start






