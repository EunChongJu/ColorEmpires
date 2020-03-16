// 이 js파일의 용도는 국가명을 랜덤으로 작명해주는 알고리즘임.
// 분리 사유: 코드가 길고, 핵심을 찾기 힘듬.


// Country Random Naming
function randomNamingCountry() {
	document.getElementById('country').value = namingCountry();
}
var namingCountry = function() {
	var countryMem = new NameCountryMemory();
	
	return countryMem.getCountryName();
}
// Country Naming Algorithm: function class
var NameCountryMemory = function() {
	this.COUNTRY_MEM = [
		// 0
		['', 'United', 'Empire of', 'Republic of', 'Federation of', /*'Democratic Republic of', 'Democratic People\'s Republic of', 'People\'s Republic of',*/ 'Federal Republic of', 'Kingdom of', 'State of'],
		// 1
		['', 'Central', 'Saint', 'Arab', 'the', 'South', 'North', 'West', 'East', 'New', 'Neutral Zone', 'States of'],
		// 2
		['Stropia', 'Ostripia', 'Istropia', 'Estropia', 'Ustropia', 'Astropia', 'Utopia', 'Helljoseon', 'Jarya', 'Unity', 'Sverige', 'Suomen', 'Ruski', 'Ukaina', 'Norge', 'Tuirkiye', 'Ceska', 'Slovak', 'Brackets', 'Servia', 'Estii', 'Xenon', 'Latvia', 'Maskva', 'Java', 'Electron', 'Maladez', 'Zeronimo'],
		// 3
		['', 'Islands', 'Republic', 'Federation', 'Kingdom', 'Empire', 'States']
	];
	
	this.getCountryName = function() {
		var arr = new Array(4);
		
		for (var i = 0; i < this.COUNTRY_MEM.length; i++) {
			var min = 0, max = this.COUNTRY_MEM[i].length - 1, index = 0;
			
			// 0단계에 'State of'가 채택되었다면, 1단계에서 'States of'를 제외.
			// 또한 0단계에서 'of'로 끝나면, 'States of'를 제외.
			if (i == 1 && (arr[0] == 0 || arr[0] == 1)) {
				max--;
			}
			// 0단계에 'State of'가 채택되었다면, 3단계에서 'States'를 제외.
			// 또는 0단계에서 ''와 'United'를 제외한 어떤것이든 채택되었다면, 3단계에서 ''와 'Island'만 채택.
			// 또는 1단계에서 'States of'가 채택되었다면 3단계에서 'states'를 제외한다.
			if (i == 3 && (arr[0] == (this.COUNTRY_MEM[0].length-1))) {
				max--;
			}
			if (i == 3 && (arr[0] == 0 || arr[0] == 1)) {
				max = 1;
			}
			if (i == 3 && (arr[1] == (this.COUNTRY_MEM[1].length-1))) {
				max--;
			}
			
			index = this.getRandomIntInclusive(min, max);
			
			arr[i] = index;
		}
		
		var countryName = '';
		
		for (var j = 0; j < 4; j++) {
			if ((j != 0) || (j != 3)) {
				if ((j==1) && (arr[j-1] != 0)) {
					countryName += ' ';
				}
				if ((j==2) && (arr[j-1] != 0)) {
					countryName += ' ';
				}
			}
			
			countryName += this.COUNTRY_MEM[j][arr[j]];
			
			if ((j==2) && (arr[j+1] != 0)) {
				countryName += ' ';
			}
		}
		
		return countryName;
	};
	
	this.getRandomIntInclusive = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
	};
};

