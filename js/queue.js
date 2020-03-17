// 이 파일은 큐 형태의 저장 방법을 사용하여 용량을 아끼기 위함이다.

//Queue Class
function Queue(){
	var items = [];
	
	this.enqueue = function(element){
		items.push(element);
	};
	this.dequeue = function(){
		return items.shift();
	};
	this.front = function(){
		return items[0];
	};
	this.isEmpty = function(){
		return items.length == 0;
	};
	this.clear = function(){
		items = [];
	};
	this.size = function(){
		return items.length;
	};
	this.print = function(){
		console.log(items.toString());
	};
}

/*
// 사용법 예제
var queue = new Queue();
console.log(queue.isEmpty());	//true

queue.enqueue("John");
queue.enqueue("Jack");
queue.enqueue("Camila");

queue.print();
console.log(queue.size());	//3
console.log(queue.isEmpty());	//false
queue.dequeue();
queue.dequeue();
queue.print();
*/
