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
	//[0]: option(countryName, mapSize, startPosition); [1]: score and point, [2]: saveColorMap;
	// var option
	
	this.coreMap = null;	// 포인트와 옵션(국가명, width, height, cp), 맵(컬러), 등을 저장.
	// coreMap[0]: map, [1]: option(cn,w,h,cp), [2]: point, [3]: lastScoreList, [4]: ,...
	
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
		try {
			if (this.checkTempVarNull(option[2])) {	// temp에 오류가 있다면, 오류를 처리 (배열 유무로 판단)
				this.callAlertDistroy(option[2]);
				
				throw "tempRecordsError";
//				throw new Error("tempRecordsError");
			}
			this.setCoreMap();
			this.setOption(option);

			this.saveMap(
				this.createMap(this.getWidth(),this.getHeight())
			);

			this.setRandomColorMap();
			this.setCP();

			return true;
		}
		catch(e) {
			console.error("tempRecordsError", e.message);
			console.error("Because Error is you have are interpreter of JS, Have not recorded temp!");
		}
	}
	
	this.setCoreMap = function() {
		this.coreMap = new Array(5);
	}
	
	this.checkTempVarNull = function(tmp) {
		if (Array.isArray(tmp)) {
			return true;
		}
	}
	
	// 배열로 맵을 (w*h)만큼 만들어서 반환.
	this.createMap = function(width, height) {
		return (newTwiceArray(width, height));
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
	
	// 변경된 사항을 저장하는 함수 (= this.setMap() {...} )
	this.saveMap = function(map) {
		this.coreMap[0] = map;
	}
	
	// 맵을 조회 (실수로 잘못된 값을 저장하면 안되니, 복제하여 변경 후 저장하는 방식을 채택한다. 그래서 복제를 위한 것임)
	this.getMap = function() {
		return this.coreMap[0];
	}
	
	// 맵을 다 훝어본다. (비슷한 함수를 구조체만 구현해놓음) 훝어보면서 callback를 통해 함수가 실행이 된다.
	// 거의 같은 구조에 다른 기능을 위해 만듬.
	this.readMap = function(callback) {
		/*
		var w = this.coreMap[1].width;
		var h = this.coreMap[1].height;
		
		for (var i = 0; i < w; i++) {
			for (var j = 0; j < h; j++) {
				callback();
			}
		}*/
		return callback;
	}
	
	// 맵 출력
	this.printMap = function() {
		var map = this.getMap();
		for (var i = 0; i < this.getWidth(); i++) {
			for (var j = 0; j < this.getHeight(); j++) {
				console.log('['+i+','+j+'] = '+map[i][j]);
			}
		}
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
	
	// 인덱스 유효성 검사
	this.validCheckIndex = function(x,y) {
		var w = this.getWidth(), h = this.getHeight();
		
		return !((x < 0) || (x >= w) && (y < 0) || (y >=h));
	}
	/*
	for (var i = -1; i < 2; i+=2) {
		for (var j = -1; j < 2; j+=2) {
			// 이걸로 유효성 검사를 통해 맵 밖으로 나가는 오류를 막을 수 있다.
			if (this.validCheckIndex((x+i), (y+j))) {
				check.push(map[x+i][y+j]);
			}
		}
	}
	*/
	
	//cp 값의 실제 좌표를 저장
	this.saveCP = function(x,y) {
		this.coreMap[1].posX = x;
		this.coreMap[1].posY = y;
	}
	// cp 좌표 값을 반환
	this.getCP = function() {
		return {x: this.coreMap[1].posX, y: this.coreMap[1].posY};
	}
	
	// 맵 컬러 세팅을 완료하고 나면, cp에 따라 배치될 곳을 확인한다.
	// 시작 부분의 색깔은 인접한 주변 색깔과 다른 색이여야 한다.
	this.setCP = function() {
		var point = this.cpInter();
		var x = point.x, y = point.y;
		var map = this.getMap();
		
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
	
	// 맵의 색깔이 바뀌는 함수
	
	
	// 각 셀마다 색깔이 바뀌는 함수
	
	
	this.setColorCell = function(x, y, color) {
		var val = this.referenceVal(x,y);
		
		this.coreMap[0][x][y] = color;
		
		return val;
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
	
	// 옵션을 조회
	this.getOption = function() {
		return {
			width: this.getWidth(),
			height: this.getHeight(),
			cp: this.getCapitalPosition(),
			cn: this.getCountryName()
		};
	}
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
	
	// 게임 포인트 현황을 관리
	this.getPoint = function() {
		return this.coreMap[2];
	}
	this.setPoint = function(point) {
		this.coreMap[2] = point;
	}
	this.addPoint = function(num) {
		this.setPoint(this.getPoint() + num);
	}
	this.subPoint = function(num) {
		this.setPoint(this.getPoint() - num);
	}
	this.multiPoint = function(num) {
		this.setPoint(this.getPoint() * num);
	}
	this.divstractPoint = function(num) {
		this.setPoint(this.getPoint() / num);
	}
	
	
	
	// 게임 오버시 포인트 정리
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}



// 배열로 맵을 만드는 함수
function newTwiceArray(w,h) {
	var arr = new Array(w);

	for (var n = 0; n < w; n++) {
		arr[n] = new Array(h);
	}

	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}

