
// 현재 그래프 인덱스
var graphIndex = 1;

// 포인트 계산을 하고 집계 후 저장.
// 여기서 core에 있는 정산시스템을 거쳐 정산한 후, 배열 값을 반환받고 core 시스템이 종료된다.
function pointAnalyzing() {
	// 여기서 정리를 다하고, 분석을 완료하면, 그래프 창을 만든다. 만들어서 안보이는데 띄우고, 나중에 보여질 것.
	
	// 포인트 배열을 통째로 반환 받는다.
	var arr = ce.returnArrayOfPoints();
	
	showGraph();
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


function activeAnalysisGraph() {
	// Point
	var pointChart = bb.generate({
		bindto: "#pointChart",
		data: {
			columns: [
				["Point", 30, 200, 100, 170, 150, 250],
				["Bonus", 130, 100, 140, 35, 110, 50]
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

	var conquerArr = [30, 280, 951, 400, 150, 546, 4528];
	conquerArr.unshift("Conquer");

	var remainingArr = [130, 357, 751, 400, 150, 250, 3957];
	remainingArr.unshift("Remaining");

	// Conquer and Remaining
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

	// Previous record
	var PRChart = bb.generate({
		bindto: "#PRChart",
		data: {
			columns: [
				["Previous", 30, 200, 100, 170, 150, 250],
				["data", 130, 100, 140, 35, 110, 50]
			],
			types: {
				Previous: "line",
				data: "area"
			},
			colors: {
				Previous: "#00DA26",
				data: "#00A2FF"
			}
		}
	});
}
