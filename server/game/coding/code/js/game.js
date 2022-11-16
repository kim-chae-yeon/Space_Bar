const key = {
	keyDown : {},
	keyValue : {
		27: 'esc',
		80: 'portal',
		37: 'left',
		39: 'right',
		88: 'attack',
		67: 'slide',
		90: 'jump', // 점프 기능 추가
	}

}

const allMonsterComProp = {
	arr: []
}
const blockComProp = {
	arr: []
}

const bulletComProp = {
	launch: false,
	arr: []
}

const gameBackground ={
	gameBox: document.querySelector('.game'),

}

const stageInfo = {
	stage: [],
	totalScore: 0,
	monster: [
		{defaultMon: greenMon, bossMon: greenMonBoss},
		{defaultMon: yellowMon, bossMon: yellowMonBoss},
		{defaultMon: pinkMon, bossMon: pinkMonBoss}
	],
	callPosition: [100, 100, 100, 100, 100]
}

const gameProp = {
	screenWidth : window.innerWidth,
	screenHeight : window.innerHeight,
	gameOver : false
}

const renderGame = () => {
	hero.keyMotion();
	setGameBackground();

	bulletComProp.arr.forEach((arr, i) => {
		arr.moveBullet();
	});
	allMonsterComProp.arr.forEach((arr, i) => {
		arr.moveMonster();
	});
	stageInfo.stage.clearCheck();
	window.requestAnimationFrame(renderGame);

}

//game over
const endGame = () => {
	gameProp.gameOver = true;
	key.keyDown.left = false;
	key.keyDown.right = false;
	document.querySelector('.game_over').classList.add('active');

}

const setGameBackground = () => {
	let parallaxValue = Math.min(0, (hero.movex-gameProp.screenWidth/3) * -1);
	if (parallaxValue < -1500) {
		parallaxValue = -1500;
	 } 
	gameBackground.gameBox.style.transform = `translateX(${parallaxValue}px)`;
	let parallaxValue_block = hero.movex-gameProp.screenWidth;
	for(let i =0; i< blockComProp.arr.length;i++)
	{
		blockComProp.arr[i].el.style.transform = `translateX(${parallaxValue}px)`;
	}

	var stageUrl

	if(stageInfo.portal_flag == true){
		stageUrl = ("../../../lib/images/background/stage2_image.jpg")
	} else {
		stageUrl = ("../../../lib/images/background/stage1_image.jpg")
	}

	gameBackground.gameBox.style.backgroundImage = "url('"+stageUrl+"')"


	// nextStage(){
	// 	var stage2Url = ("../../../lib/images/background/stage2_image.jpg")
	// 	this.parentNode.style.backgroundImage = "url('"+stage2Url+"')"
	// }

	// 구조물 페럴릭스 적용 완료
}

const windowEvent = () => {
	window.addEventListener('keydown', e => {
		if(gameProp.gameOver) {
			key.keyDown[key.keyValue[e.which]] =false;
			key.keyDown['esc'] = true;
			if(key.keyDown['esc']){
				window.location.replace('/');
			}
		}
		else
			key.keyDown[key.keyValue[e.which]] =true;

	});

	window.addEventListener('keyup', e => {
		key.keyDown[key.keyValue[e.which]] = false;
	});

	window.addEventListener('resize', e => {
		gameProp.screenWidth = window.innerWidth;
		gameProp.screenHeight = window.innerHeight;
	});
}

const loadImg = () => {
	const preLoadImgSrc = ['../../../lib/images/ninja_attack.png', '../../../lib/images/ninja_run.png'];
	preLoadImgSrc.forEach( arr => {
		const img = new Image();
		img.src = arr;
	});
}

let hero;

const init = () => {
	hero = new Hero('.hero');
	stageInfo.stage = new Stage();
	blockComProp.arr[0] = new Block(block_1);
	blockComProp.arr[1] = new Block(block_2);
	blockComProp.arr[2] = new Block(block_3);
	blockComProp.arr[3] = new Block(block_4);
	loadImg();
	windowEvent();
	renderGame();
}

window.onload = () => {
	init();
}






