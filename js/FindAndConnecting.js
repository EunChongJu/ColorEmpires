// 이건 만약에 스택을 초과한다는 에러가 발생하면, 이 알고리즘을 사용해도 됨.

var map = null;			// 지도를 저장
var filterMap = null;	// 필터링된 지도를 저장
var pos = null;			// 시작위치를 저장

function startActive(w,h) {
	map = new makeMap(w,h);
}

function makeMap(w,h) {
	var map = new Array(w);
	for (var i = 0; i < w; i++) {
		map[i] = new Array(h);
		
		for (var j = 0; j < h; j++) {
			map[i][j] = 0;
		}
	}
	return map;
}

function setStartPos(x,y) {
	map[x][y] = 2;		// 2는 색깔 변경이 확정된거.
	pos = {x: x, y: y};
}

function setCellVal(x,y) {
	map[x][y] = 1;		// 1은 찾을 값
}

function findCell(val) {
	filterMap = findValInTable(val);
}

function findValInTable(val) {		// 찾으려는 값: val
	var w = map.length;
	var h = map[0].length;
	var filter = new makeMap(w, h);
	
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < h; j++) {
			if (map[i][j] == val) {
				filter[i][j] = val;
			}
		}
	}
	console.dir(filter);
	
	return filter;
}

// 이 함수는 맵 탐색에서 밖으로 벗어나지 않기 위한 방법이다.
function validCheckIndex(x,y) {	// 현재위치의 주변에는 맵을 벗어나는 곳인가?
	var w = map.length, h = map[0].length;
	
	var widthValid = !((x < 0) || (x >= w));	// 그중에 하나라도 벗어난다면 false
	var heightValid = !((y < 0) || (y >= h));	// 그중에 하나라도 벗어난다면 false
	/*
	console.log('x, y : '+x+', '+y);
	console.log('widthValid : ' + widthValid);
	console.log('heightValid : ' + heightValid);
	*/
	return (widthValid && heightValid);	// 둘다 벗어나지 않는다면, true
}

function printMap() {
	console.dir(map);
}
function printFilterMap() {
	console.dir(filterMap);
}



// 스택의 역할은 갈림길을 저장한다. : 나중에 잎 부분에 탐색이 끝나면 다시 가지의 갈림길로 되돌아 가기 위함.
var stack = null;

function start() {	// 스타트. 스택을 활성화 시킨다.
	stack = new Stack();
	// 아마 여기가 분기점이라면 최초의 분기점이 될 것이며 끝은 여기가 될 것
}

// 현재 위치에서 갈 수 있는 길(1이란 값)을 찾아서 그 중에 한가지를 반환한다.
// 근데 문제가 있을거 없다. 분기점에 다시 되돌아 가니깐.
// 아, 글고 이 함수는 이미 길이 확정된 상태에서 실행되는 것이다.
// 혹시 모르니까 맵 밖으로 벗어나지 않는지 체크하고 좌표를 반환한다.
function path(x,y) {
	for (var i = -1; i <= 1; i++) {
		if (validCheckIndex((x + i), y)) {
			if (filterMap[x+i][y] == 1) {
				return {x: x+i, y: y};
			}
		}
		if (validCheckIndex(x, (y + i))) {
			if (filterMap[x][y+i] == 1) {
				return {x: x, y: y+i};
			}
		}
	}
}

// 주변을 탐색하여 갈 수 있는 길이 몇개인지 리턴하고, 2개 이상의 길이 있다면 분기점이라고 스택에 저장된다.
function find(ix,iy) {
	var check = 0;
	
	console.log('find() : '+ix+','+iy);
	
	/*
	if (validCheckIndex((ix - 1),iy)) {	// W
		var pos = filterMap[ix-1][iy];
		
		console.log('W can.');
		
		if (pos == 1) {
			check++;
		}
	}
	
	if (validCheckIndex(ix,(iy - 1))) {	// S
		var pos = filterMap[ix][iy-1];
		
		console.log('S can.');
		
		if (pos == 1) {
			check++;
		}
	}
	
	if (validCheckIndex((ix + 1),iy)) {	// E
		var pos = filterMap[ix+1][iy];
		
		console.log('E can.');
		
		if (pos == 1) {
			check++;
		}
	}
	
	if (validCheckIndex(ix,(iy + 1))) {	// N
		var pos = filterMap[ix][iy+1];
		
		console.log('N can.');
		
		if (pos == 1) {
			check++;
		}
	}
	*/
	
	for (var i = -1; i <= 1; i++) {
		if (validCheckIndex((ix + i), iy)) {
			var pos = filterMap[ix + i][iy];
			
			if (pos == 1) {
				check++;
			}
		}
		if (validCheckIndex(ix, (iy + i))) {
			var pos = filterMap[ix][iy + i];
			
			if (pos == 1) {
				check++;
			}
		}
	}
	
	
	if (check > 1) {	// 길이 한군데가 아니라면 -> 분기점으로 스택에 저장
		stack.push({x: ix, y: iy});
	}
	console.log('find() : junction? : ' + check);
	
	return check;
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

// 잎 부분에서 막혀서 되돌아가려는데
// 만약에 분기점이 (최초 분기점은 cp라 불리는 장소이며, 스택에 저장되어 있음)
// 하나도 없다면, 이는 탐색이 완료되었다고 가정할 수 있다.
// 그러므로 탐색이 완료 즉시 while (true)에서 break;를 걸어서 빠져나온다.

// 이미 탐색했거나 막혀있으면 어쩔수없이 되돌아갈때
// (스택 상에서 왔던 길 중에 가장 가까지 있는 갈림길이 있는 곳으로)

// 일단 현재위치는 x,y에 저장되며, 반복되는 구문 안에서 할일은 이것이다.
// 일단 첫번째 현재위치에서, 즉 시작점에서 주변에 갈 수 있는 길의 수를 검색한다.
// 길을 검색하면서 길이 1개면 x와 y를 바꾸어서 거기로 간다.
// 만약 길이 2개라면, 이 위치를 분기점이라 하여 스택에 저장한 다음, 갈 길을 간다.

// 만약 길이 2개 이상인데 제일 먼저 간 길이 다른 길과 연결되어서 탐색이 완료되었다면,
// 그에 대비해서 분기점으로 돌아와서 한번 더 탐색을 하도록 한다.

// 이거는 filterMap에서 1인 값을 가진 주변 셀을 찾아내는 것이다.
// 그런데 문제는 셀에 있어서 분기점이란 것이다.
// 분기점에서 가기 전에 갈 길을 선택해야 하는데, 
// 그 길로 선택하면, 그 길의 좌표를 알아내서
// 거기로 x,y 값을 변경하여 가야 한다.

function active() {
	var x = pos.x, y = pos.y;
	
	start();
	
	while (true) {
//		console.log('current : '+x+','+y);
		
		if (find(x,y) > 0) {	// 만약 길이 있다면 (분기점은 find()에서 처리함.)
			// path() 함수를 실행
			way = path(x,y);
			
			x = way.x;
			y = way.y;
			
			filterMap[x][y] = 2;	// 여기를 탐색했음을 알리는 값으로 하나 올린다.
		}
		else {	// 길이 없다면, 되돌아갈 길을 찾는다.
			if (!stack.isEmpty()) {	// 분기점이 없을 때까지 조회하며, 최근의 분기점으로 돌아간다.
				var spot = stack.pop;
				
				x = spot.x;
				y = spot.y;
			}
			else {	// 분기점이 없다면, 이는 탐색이 완료되었다는 얘기다.
				break;
			}
		}		// 여느때나 상관없이 go() 함수로 x,y를 지정하면 조건문 분기를 거치고 원래대로 돌아간다.
		
//		console.log('active : '+x+','+y);
	}
}


// TEST ZONE
startActive(5, 5);
setStartPos(0,0);

setCellVal(0,1);
setCellVal(1,1);
setCellVal(2,1);
setCellVal(2,2);
setCellVal(3,2);
setCellVal(4,3);

findCell(1);
active();

console.dir(filterMap);