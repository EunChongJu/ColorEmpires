/* 
 * Unification of Color Empires Game - Current Version. 1.1
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






var CEG = function() {
	this.colorMap = null;	// Map - current
	this.mapSize = null;	// map size : width, height
	this.colorList = null;	// list of color country
	
	this.startSpot = null;	// start spot : in the game, change to color at start spot.
	
	// 게임을 시작함으로 맵과 크기, 컬러국가 지정 등 모든 것을 세팅한다.
	this.startGame = function(width, height, colorArr, spot) {
		this.colorMap = this.setMap({width: width, height: height});
		
		this.colorList = colorArr;
		this.startSpot = spot;	// (Left(L), Center(C), Right(R)) : (Top(T), Middle(M), Bottom(B))
	};
	
	// 맵의 사이즈를 인자로 받아서 맵을 만든다.
	this.setMap = function(mapOption) {
		this.mapSize = mapOption;
		
		var map = new Array(mapOption.width);
		
		for (var i = 0; i < mapOption.width; i++) {
			map[i] = new Array(mapOption.height);
		}
		
		return map;
	};
	
	// 컬러를 바꾸기 시작한다. 그리고 주변과 같은 컬러는 바뀌는 컬러로 바뀐다.
	this.changeColor = function() {
		
	};
	
	// 주변국과 색깔이 일치하면 합병을 한다. 그리고 합병점수를 정산을 여기서 한다.
	this.mergeColor = function() {
		
	};
	
	
	
	
	
	
	
	
	// 컬러제국이 모든 국가를 채웠는지 검사한다.
	this.checkColorFullFill = function() {
		var temp = this.colorMap;
		var flag = true;
		for (var i = 0; i < this.mapSize.width; i++) {
			for (var j = 0; j < this.mapSize.height; j++) {
				if (temp) {
					
				}
			}
		}
	};
	
	// 시작 좌표의 색깔을 반환한다.
	this.getColorStartSpot = function() {
		var {x, y} = this.getStartSpot(this.getStartSpotCode());
		var color = this.colorMap[x][y];
		
		return color;
	};
	
	this.getStartSpotCode = function() {
		var s = this.startSpot;
		return {x: s.charAt(0), y: s.charAt(1)};
	}
	
	// 시작 좌표의 인덱스를 리턴 (a, v)는 각각 LCR, TMB를 가리킨다.
	this.getStartSpot = function(a, v) {
		var x, y;
		
		if (a == 'L') {
			x = 0;
		}
		else if (a == 'R') {
			x = this.mapSize.width - 1;
		}
		else {
			if (this.mapSize.width % 2 == 0) {
				x = (this.mapSize.width / 2) - 1;
			}
			else {
				x = (this.mapSize.width - 1) / 2;
			}
		}
		
		if (v == 'T') {
			y = 0;
		}
		else if (v == 'B') {
			y = this.mapSize.height - 1;
		}
		else {
			if (this.mapSize.height % 2 == 0) {
				y = (this.mapSize.height / 2) - 1;
			}
			else {
				y = (this.mapSize.height - 1) / 2;
			}
		}
		
		return {x: x, y: y};
	}
};


// TEST ZONE
var ceg = new CEG();


