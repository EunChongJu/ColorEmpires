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

// 이 js파일은 core라 함은 코어, 즉 게임의 핵심 알고리즘이 되시겠다.
// 이 js파일은 클래스 형태를 띄며, 직접적으로 웹 브라우저 상에 직접적으로 표시 하지 않음.
// 대신, game.js가 core.js의 클래스를 GUI 형태로 표시해 줌.


// 맵에 저장되는 값은 문자가 아닌 숫자다.
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

var coreCE = function() {
	
	this.coreMap = null;	// 포인트와 옵션(국가명, width, height, cp), 맵(컬러), 등을 저장.
	// coreMap[0]: map, [1]: option(cn,w,h,cp), [2]: point, [3]: lastScoreList, [4]: ,...
	
	// 현재 점령지 수를 저장
	var conquer = 0;
	// analysisGraph에 쓰이기 위한 포인트의 배열
	var pointArr = new Array();
	
	this.start = function(option) {
		/*
		console.dir('active start() - option:' + option);
		console.dir('countryName: '+option[0].countryName);	// 옵션: countryName
		console.dir('width: '+option[0].width);			// 옵션: width
		console.dir('height: '+option[0].height);		// 옵션: height
		console.dir('cp: '+option[0].position);			// 옵션: captial position(start position)
		console.dir('point: '+option[1]);		// 계승된 포인트 (여기서 배열 형태로 저장됨)
		console.dir('null: '+option[2]);		// 아무 의미 없음, temp격임.
		*/
		
		// coreMap을 초기화
		this.coreMap = new Array(2);
		
		// 옵션을 저장
		this.setOption(option);
		
		// 스택을 호출
		stack = new Stack();
		
		// 맵과 필터맵을 만들고 저장
		this.saveMap(this.createMap());
		filterMap = this.createMap();
		
		// 컬러를 무작위로 배치
		this.setRandomColorMap();
		
		// CP를 배치하고 저장
		this.setCP();
		
		return true;
	}
	
	// 옵션을 저장
	this.setOption = function(option) {
		var opt = {
			width: option[0].width,
			height: option[0].height,
			position: option[0].position,
			posX: 0,
			posY: 0,
			countryName: option[0].countryName
		};
		this.coreMap[1] = opt;
	}
	
	// 맵을 만들어서 반환
	this.createMap = function() {
		var w = this.getWidth();
		var h = this.getHeight();
		
		var map = new Array(w);
		
		for (var i = 0; i < w; i++) {
			map[i] = new Array(h);

			for (var j = 0; j < h; j++) {
				map[i][j] = 0;
			}
		}
		return map;
	}
	
	// 맵 안에 컬러를 무작위로 배치
	this.setRandomColorMap = function() {
		var w = this.getWidth();
		var h = this.getHeight();
		var map = this.getMap();
		
		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				map[i][j] = this.getRandomColor();	// 여기서 숫자로 저장됨
			}
		}
		
		this.saveMap(map);
	}
	
	//{
	// 컬러를 무작위로 호출하여 반환.
	this.getRandomColor = function() {
		return this.getRandomIntInclusive(1,8);
	}
	
	// 최댓값과 최솟값을 포함한 랜덤값을 반환
	this.getRandomIntInclusive = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		
		return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
	};
	//}
	
	// 변경된 사항을 저장하는 함수 (= this.setMap() {...} )
	this.saveMap = function(map) {
		this.coreMap[0] = map;
	}
	
	// 맵을 조회 (실수로 잘못된 값을 저장하면 안되니, 복제하여 변경 후 저장하는 방식을 채택한다. 그래서 복제를 위한 것임)
	this.getMap = function() {
		return this.coreMap[0];
	}
	
	// 맵 좌표값을 통해 컬러 값을 반환
	this.referenceVal = function(x,y) {
		var value = this.coreMap[0][x][y];
		return value;
	}
	
	// 맵 크기를 반환
	this.referenceMapLength = function() {
		var x = this.coreMap[1].width;
		var y = this.coreMap[1].height;
		
		return {x: x, y: y};
	}
	
	//{
	// cp 좌표 값을 반환
	this.getCP = function() {
		return {x: this.coreMap[1].posX, y: this.coreMap[1].posY};
	}
	
	// 맵 컬러 세팅을 완료하고 나면, cp에 따라 배치될 곳을 확인한다.
	// 시작 부분의 색깔은 인접한 주변 색깔과 다른 색이여야 한다.
	this.setCP = function() {
		var map = this.getMap();
		var point = this.cpInter();
		var x = point.x, y = point.y;
		
		this.saveCP(x,y);
		
		map[x][y] = 0;
		
		this.saveMap(map);
	}
	// cp의 실제 좌표를 계산하여 반환
	this.cpInter = function() {
		var w = this.getWidth();	// 여기서 w와 h는 1부터 계산한 값이므로, 0부터 최대의 거리는 w-1임.
		var h = this.getHeight();
		var pos = this.cpJuncVal(this.getCapitalPosition());
		var x, y;
		
		if (pos.x == -1) {
			x = w - 1;
		}
		else if (pos.x == -2) {
			if (w % 2 == 0) {	// 짝수라면, 중간 값이 소숫점으로 나오므로 좌우 배치 결정을 무작위로 결정
				x = (w / 2) - this.getRandomIntInclusive(0,1);
			}
			else {	// 홀수라면
				x = (w - 1) / 2;
			}
		}
		else {
			x = pos.x;
		}
		
		if (pos.y == -1) {
			y = h - 1;
		}
		
		if (pos.y == -1) {
			y = h - 1;
		}
		else if (pos.y == -2) {
			if (w%2==0) {	// 짝수라면, 중간 값이 소숫점으로 나오므로 좌우 배치 결정을 무작위로 결정
				y = (h / 2) - this.getRandomIntInclusive(0,1);
			}
			else {	// 홀수라면
				y = (h - 1) / 2;
			}
		}
		else {
			y = pos.y;
		}
		
		return {x: x, y: y};
	}
	//cp 값의 실제 좌표를 저장
	this.saveCP = function(x,y) {
		this.coreMap[1].posX = x;
		this.coreMap[1].posY = y;
	}
	
	this.cpJuncVal = function(pos) {
		var x,y;	// 이 값이 -1이라면 끝 부분(length-1), -2라면 중간부분을 가리킴
		switch(pos) {
			case 1:
				x=0;
				y=0;
				break;
			case 2:
				x=-1;
				y=0;
				break;
			case 3:
				x=0;
				y=-1;
				break;
			case 4:
				x=-1;
				y=-1;
				break;
			case 5:
				x=-2;
				y=0;
				break;
			case 6:
				x=0;
				y=-2;
				break;
			case 7:
				x=-2;
				y=-1;
				break;
			case 8:
				x=-1;
				y=-2;
				break;
			case 9:
				x=-2;
				y=-2;
				break;
		}
		return {x: x, y: y};
	}
	//}
	
	// 옵션의 모든 값을 세부적으로 반환
	this.getWidth = function() {
		return this.coreMap[1].width;
	}
	this.getHeight = function() {
		return this.coreMap[1].height;
	}
	this.getCapitalPosition = function() {
		return this.coreMap[1].position;
	}
	this.getCountryName = function() {
		return this.coreMap[1].countryName;
	}
	
	// 인덱스 및 셀 위치 유효성 검사
	this.validCheckIndex = function(x,y) {
		var w = this.getWidth()
		var h = this.getHeight();
		
		var widthValid = !((x < 0) || (x >= w));	// 그중에 하나라도 벗어난다면 false
		var heightValid = !((y < 0) || (y >= h));	// 그중에 하나라도 벗어난다면 false
		
		return (widthValid && heightValid);	// 둘다 벗어나지 않는다면, true
	}
	
	//{
	// 점령지 수 갱신
	this.setConquer = function() {
		var conquer = 0;
//		console.log('conquer 실행됨');
		for (var i = 0; i < this.getWidth(); i++) {
			for (var j = 0; j < this.getHeight(); j++) {
				if (filterMap[i][j] == 2) {
					conquer++;
				}
			}
		}
		return conquer;
	}
	
	this.getConquer = function() {
		return conquer;
	}
	
	
	//// 클릭 이벤트
	
	// 설명:
	// 1. 맵 전체에서 같은 색을 가진 셀만 찾아서 필터맵에 저장한다.
	// 2. 필터맵에서 cp라 하는 시작점으로 온다.
	// 3. 이 셀에서 주변의 인접한 셀을 탐색하여 길을 찾는다.
	//  3.1. 탐색 결과 길이 1개라면
	//   3.1.1. 4.로 이동한다.
	// 
	//  3.2. 탐색 결과 길이 2개 이상이라면
	//   3.2.1. 알아서(?) 갈 곳을 찾아 4.로 이동한다.
	// 
	//  3.3. 탐색 결과 길이 없다면: 
	//   3.3.1. 이 셀은 말단 셀이라 한다.
	//    3.3.1.1. 스택 상 가장 최근의 분기점으로 돌아간다.
	//    3.3.1.2. 최근의 분기점으로 돌아오면, 3.으로 돌아간다.
	// 
	//   3.3.2. 만약, 분기점이 없다면, 6.으로 옮긴다.
	// 
	// 4. 갈 곳으로 좌표를 알아낸 다음, 거기로 옮긴다.
	// 5. 옮겼으면 다시 이 셀에서부터 탐색을 하기 위해 3.으로 이동한다.
	// 6. 종료한다.
	// 
	// 이처럼 이 과정을 FindAndConnecting 알고리즘이라 하여 재귀함수 없이 효율적으로 사용할 수 있다.
	
	// 이 함수의 기능은 단지 연결된 셀의 갯수를 계산하여 점령지 수를 계산하여 반환하는 것뿐. (원래는 색깔 바꾸는거였다)
	this.clickCellActive = function(color) {	// 컬러가 나오면, 그 값을 가지고 색깔을 바꾸게 한다.
//		console.log('--clickCellActive START');
		
		map = this.getMap();
		
		this.filterClean();
		
		this.findVal(color);
		
		this.active();
		
		conquer = this.setConquer();
		
//		console.log('conquer : '+ this.getConquer());
//		console.log('--clickCellActive END');
	}
	
	this.filterClean = function() {
		for (var i = 0; i < this.getWidth(); i++) {
			for (var j = 0; j < this.getHeight(); j++) {
				filterMap[i][j] = 0;
			}
		}
	}
	
	this.findVal = function(val) {
		this.findValInTable(val);
		
		var pos = this.getCP();
		map[pos.x][pos.y] = val;
	}
	
	this.findValInTable = function(val) {		// 찾으려는 값: val
		for (var i = 0; i < this.getWidth(); i++) {
			for (var j = 0; j < this.getHeight(); j++) {
				if (map[i][j] == val) {
					filterMap[i][j] = 1;		// filterMap 생성때 전부 0으로 해놓았기 때문에, 1을 저장한다.
				}
			}
		}
	}
	
	this.printStack = function() {
		stack.print();
	}
	
	
	// 분기점을 저장
	var stack = null;
	// 필터와 맵을 저장
	var filterMap = null;
	var map = null;
	
	// 현재 위치에서 갈 수 있는 길(1이란 값)을 찾아서 그 중에 한가지를 반환한다.
	this.path = function(x,y) {
//		console.log('path(x, y) : ' + x + ', ' + y);
		
		for (var i = -1; i <= 1; i++) {
			if (this.validCheckIndex((x + i), y)) {
				if (filterMap[x+i][y] == 1) {
					return {x: x+i, y: y};
				}
			}
			if (this.validCheckIndex(x, (y + i))) {
				if (filterMap[x][y+i] == 1) {
					return {x: x, y: y+i};
				}
			}
		}
	}

	// 주변을 탐색하여 갈 수 있는 길이 몇개인지 리턴하고, 2개 이상의 길이 있다면 분기점이라고 스택에 저장된다.
	this.find = function(x,y) {
		var check = 0;
		
//		console.log('find(x, y) : ' + x + ', ' + y);
		
		for (var i = -1; i <= 1; i++) {
			if (this.validCheckIndex((x + i), y)) {
				var pos = filterMap[x + i][y];
				
				if (pos == 1) {		// 필터값이 무조건 1인것만 찾음.
					check++;
				}
			}
			if (this.validCheckIndex(x, (y + i))) {
				var pos = filterMap[x][y + i];
				
				if (pos == 1) {		// 필터값이 무조건 1인것만 찾음.
					check++;
				}
			}
		}
		
		if (check > 1) {	// 길이 한군데가 아니라면 -> 분기점으로 스택에 저장
			stack.push({x: x, y: y});
		}
		
//		console.log('find result = ' + check);
		
		return check;
	}
	
	// 필터를 바탕으로 연결하고 연결 가능한 셀을 2로 (저장)해서 반환.
	this.active = function() {
		var pos = this.getCP();
		var x = pos.x, y = pos.y;	// 시작점을 받이 여기서부터 탐색을 시작한다.
		filterMap[x][y] = 2;	// 시작점은 무조건 바뀌어야 함.
		
		while (true) {
//			console.log('be (x, y) : '+x+', '+y);
			
			if (this.find(x,y) > 0) {	// 만약 길이 있다면 (분기점은 find()에서 처리함.)
//				console.log('be Have a way');
				
				// path() 함수를 실행
				var way = this.path(x,y);
				
				x = way.x;
				y = way.y;
				
				filterMap[x][y] = 2;	// 여기를 탐색했음을 알리는 값으로 하나 올린다.
			}
			else {	// 길이 없다면, 되돌아갈 길을 찾는다.
//				console.log('be NOT Have a way');
				if (!stack.isEmpty()) {	// 분기점이 없을 때까지 조회하며, 최근의 분기점으로 돌아간다.
					var spot = stack.pop();
					
					x = spot.x;
					y = spot.y;
				}
				else {	// 분기점이 없다면, 이는 탐색이 완료되었다는 얘기다.
					break;
				}
			}		// 여느때나 상관없이 path() 함수로 x,y를 지정하면 조건문 분기를 거치고 원래대로 돌아간다.
		}
	}
	
	//}
	
	
	// 게임 포인트 현황을 관리
	this.getPoint = function() {
		return this.coreMap[2];
	}
	this.setPoint = function(point) {
		this.coreMap[2] = point;
		pointArr.push(point);
	}
	
	// analysisGraph를 위해 게임 포인트 배열을 반환
	this.returnArrayOfPoints = function() {
		return pointArr;
	}
	// 게임 포인트를 카운트 별로 저장을 해놓았다. 그걸 통째로 반환하여 analysisGraph에 활용된다.
	
	
	
	
	
	
	
	// 게임 오버시 포인트 정리
	
	// 웹 스토리지를 활용하여 저장한다.
	
	
	
	
	
	
	// 그리고 게임오버 절차를 밟기 위한 조치
	
	
	
	// 게임오버 전에 마지막으로 실행되는 함수
	
	
	this.shutDown = function() {
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
};
