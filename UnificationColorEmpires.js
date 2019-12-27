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

var CE = function() {
	this.map = null;
	this.attr = null;
	this.color = null;
	
	this.start = function(width, height, color) {	// 여기서 컬러는 배열 형태로 저장되며 
		this.attr = {width: width, height: height};
		this.color = color;
		
		console.log(color);
		
		this.setMap();
	}
	
	this.setMap = function() {
		this.map = allValueSetToZero(
			make2DArray(this.attr.width, this.attr.height));
		
		this.setColorCell();
	}
	
	this.setColorCell = function() {
		for (var i = 0; i < this.map.length; i++) {
			for (var j = 0; j < this.map[i].length; j++) {
				var cs = this.randomSelectColorIndex();
				
				this.map[i][j] = this.color[cs];
			}
		}
	}
	
	this.randomSelectColorIndex = function() {
		return (Math.random() * this.color.length);
	}
	
	
	
	
	
	
	
}


function make2DArray(width, height) {
	var arr = new Array(width);
	
	for (var i = 0; i < arr.length; i++) {
		arr[i] = new Array(height);
	}
	
	return arr;
}

function allValueSetToZero(arr) {
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++)
			arr[i][j] = 0;
	}
	return arr;
}










// Test Zone

var colorList = ['red', 'orange', 'green', 'blue'];
var ce = new CE();

ce.start(5, 5, colorList);

console.log(ce.map);
