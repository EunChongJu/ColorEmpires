
// 현재 그래프 인덱스
var graphIndex = 1;

// 그래프 인덱스 번호 초기화
function clearGraphIndex() {
	graphIndex = 1;
}


// 포인트 계산을 하고 집계 후 저장.
// 여기서 core에 있는 정산시스템을 거쳐 정산한 후, 배열 값을 반환받고 core 시스템이 종료된다.
function activeAnalyzing() {
	var point = ce.getPoint();
	
	// 여기서 정리를 다하고, 분석을 완료하면, 그래프 창을 만든다. 만들어서 안보이는데 띄우고, 나중에 보여질 것.
	
	// 게임상 기록한 모든 배열을 모두 반환 받는다.
	var pointArr = ce.returnArrayOfPoint();
	var conquerArr = ce.returnArrayOfConquer();
	var PRArr = getDataWebStorages();	// 얘는 Web Storage 상에 있는 기록을 전부 받아서 분석 후 저장한다.
	
	setDataWebStorages(point);
	
	pointArr.shift();	// 앞의 원소를 제거. (시초에 생성된 값으로, 사실상 필요 없음)
	conquerArr.unshift(1);	// 앞에 포함되지 않은 시포의 점령지 갯수 데이터를 추가. (무조건 1개부터 출발함))
	
	var remainingArr = returnArrayOfRemaining(conquerArr);
	var bonusArr = getArrayOfBonus();
	
	/*
	console.dir(pointArr);		// 포인트 레코드;
	console.dir(conquerArr);	// 점령지 수;
	console.dir(PRArr);			// 이전 기록 (그 앞에 현재 점수가 저장되어서 레코드에 포함됨);
	console.dir(remainingArr);	// 남은 점령지 갯수;
	console.dir(bonusArr);		// 보너스 기록;
	*/
	
	showGraph();	// 디스플레이를 표시.
	
	var data = {
		'pointArr': pointArr,
		'conquerArr': conquerArr,
		'PRArr': PRArr,
		'remainingArr': remainingArr,
		'bonusArr': bonusArr
	};
	
	activeAnalysisGraph(data);
}

function getDataWebStorages() {		// 현재 저장된 모든 것을 불러온다.
	var storageArr = new Array();
	var max = (getNumStoredStorage() + 1);
	
	for (var i = 0; i < max; i++) {
		var id = 'ceData-' + i;
		var data = localStorage.getItem(id);
		storageArr.push(data);
	}
	
	return storageArr;
}

// 아래거는 포인트를 받아서 저장하고 불러온다.
function setDataWebStorages(data) {		// 현재 기록을 정산하여 web storage에 저장한다.
	var num = (getNumStoredStorage() + 1);
	var id = 'ceData-' + num;	// 이런식의 키를 가지고 저장한다.
	
	localStorage.setItem(id, data);
}

// 맨 마지막에 저장되어야 하니 이전기록을 조회해 저장되어 있는 데이터의 갯수를 계산하여 반환
function getNumStoredStorage() {
	var k = 1;
	
	if (localStorage.getItem('ceData-0') != null) {
		while (true) {
			var id = 'ceData-'+k;

			if (localStorage.getItem(id) == null) {
				break;
			}

			k++;
		}
	}
	else {
		k = -1
	}
	
	return k;	// k가 -1로 반환되면 아무도 없다는 것임
}

function returnArrayOfRemaining(data) {
	var remainingArr = new Array();
	var max = referenceMapCellsMax();
	
	for (var i = 0; i < data.length; i++) {
		remainingArr.push(max-data[i]);
	}
	
	return remainingArr;
}


// 분석표 이전, 다음으로 넘길 때
function prevGraph() {
	if (graphIndex == 1) {
		graphIndex = 3;
	}
	else {
		graphIndex--;
	}
	showGraph();
}
function nextGraph() {
	if (graphIndex == 3) {
		graphIndex = 1;
	}
	else {
		graphIndex++;
	}
	showGraph();
}

// 분석완료한 데이터를 그래프에 보여준다.
function showGraph() {
	switch(graphIndex) {
		case 1:
			document.getElementById('pointChart').style.display = 'block';
			document.getElementById('CRChart').style.display = 'none';
			document.getElementById('PRChart').style.display = 'none';
			break;
		case 2:
			document.getElementById('pointChart').style.display = 'none';
			document.getElementById('CRChart').style.display = 'block';
			document.getElementById('PRChart').style.display = 'none';
			break;
		case 3:
			document.getElementById('pointChart').style.display = 'none';
			document.getElementById('CRChart').style.display = 'none';
			document.getElementById('PRChart').style.display = 'block';
			break;
	}
}

function activeAnalysisGraph(data) {
	// Point and Bonus Array
	var pointArr = data.pointArr;
	pointArr.unshift("Point");
	
	var bonusArr = data.bonusArr;
	bonusArr.unshift("Bonus");
	
	// Point and Bonus Chart
	var pointChart = bb.generate({
		bindto: "#pointChart",
		data: {
			columns: [
				pointArr,
				bonusArr
			],
			types: {
				Point: "line",
				Bonus: "area"
			},
			colors: {
				Point: "#00DA26",
				Bonus: "#00A2FF"
			}
		}
	});
	
	//Conquer and Remaining Array
	var conquerArr = data.conquerArr;
	conquerArr.unshift("Conquer");
	
	var remainingArr = data.remainingArr;
	remainingArr.unshift("Remaining");
	
	// Conquer and Remaining Chart
	var CRChart = bb.generate({
		data: {
			x: "x",
			columns: [
				["x", "Item1", "Item2", "Item3", "Item4", "Item5", "Item6", "Item7"],
				conquerArr,
				remainingArr
			],
			type: "bar",
			groups: [
				[
					"Conquer",
					"Remaining"
				]
			],
			stack: {
				normalize: true
			}
		},
		axis: {
			x: {
				type: "category"
			}
		},
		bindto: "#CRChart"
	});
	
	// Previous record Array
	var previousArr = data.PRArr;
	previousArr.unshift("Previous");
	
	// Previous record Chart
	var PRChart = bb.generate({
		bindto: "#PRChart",
		data: {
			columns: [
				previousArr
			],
			types: {
				Previous: "line"
			},
			colors: {
				Previous: "#00DA26"
			}
		}
	});
}
