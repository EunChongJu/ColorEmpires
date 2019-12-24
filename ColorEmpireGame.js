






var CEG = function() {
	this.colorMap = null;
	this.mapSize = null;
	this.colorList = null;
	
	this.startSpot = null;
	
	this.startGame = function(width, height, colorArr, spot) {
		this.colorMap = this.setMap({width: width, height: height});
		
		this.colorList = colorArr;
		this.startSpot = spot;	// (Left(L), Center(C), Right(R)) : (Top(T), Middle(M), Bottom(B))
	};
	
	this.setMap = function(mapOption) {
		this.mapSize = mapOption;
		
		var map = new Array(mapOption.width);
		
		for (var i = 0; i < mapOption.width; i++) {
			map[i] = new Array(mapOption.height);
		}
		
		return map;
	};
	
	this.changeColor = function() {
		
	};
	
	this.mergeColor = function() {
		
	};
	
	
	
	
	
	
	
	
	this.checkColorFullFill = function() {
		for (var i = 0; i < this.mapSize.width; i++) {
			for (var j = 0; j < this.mapSize.height; j++) {
				
			}
		}
	};
	
	
	
};


// TEST ZONE
var ceg = new CEG();


