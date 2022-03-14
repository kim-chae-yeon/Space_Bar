
const key = { //변수 선언 이거 약간 구조체 같은 느낌이던데
	keyDown : {}, // 딕셔너리 선언
	keyValue : { // 딕셔너리 값들
		37: 'left',
		39: 'right'
	}
}

const windowEvent = () => {
	window.addEventListener('keydown', e => {
		key.keyDown[key.keyValue[e.which]] = true; 
	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
	});
}

const init = () => {
	windowEvent();
}

window.onload = () => { //onload는 문서(html???)가 모두 준비된 이후에 자바스크립트가 실행되게끔 도와준다.
	init();
}