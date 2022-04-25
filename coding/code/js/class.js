class Stage {
	constructor(){
		this.level = 0;
		this.isStart = false;
		//this.stageStart();
	}
	// stageStart(){
	// 	setTimeout( () => {
	// 		this.isStart = true;
	// 		this.stageGuide(`START LEVEL${this.level+1}`);
	// 		this.callMonster();
	// 	}, 2000);
	// }
	stageGuide(text){
		this.parentNode = document.querySelector('.game_app');
		this.textBox = document.createElement('div');
		this.textBox.className = 'stage_box';
		this.textNode = document.createTextNode(text);
		this.textBox.appendChild(this.textNode);
		this.parentNode.appendChild(this.textBox);

		setTimeout(() => this.textBox.remove(), 1500);
	}
	callMonster(){
		for(let i=0; i <=5; i++){

			if(i === 5){
				allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].bossMon, hero.movex + gameProp.screenWidth + 600 * i);
			}else{
				allMonsterComProp.arr[i] = new Monster(stageInfo.monster[this.level].defaultMon, hero.movex + gameProp.screenWidth + 700 * i);
			}

		}
	}
	clearCheck(){
		stageInfo.callPosition.forEach( arr => {
			if(hero.movex >= arr && allMonsterComProp.arr.length === 0){
				this.stageGuide('ㅋㅋ몬스터 처몰려옴');
				stageInfo.callPosition.shift();

				setTimeout(() => {
					this.callMonster();
					this.level++;
				}, 1000);
			}
		});
		// if(allMonsterComProp.arr.length === 0 && this.isStart){
		// 	this.isStart = false;
		// 	this.level++;

		// 	if(this.level < stageInfo.monster.length){
		// 		this.stageGuide('CLEAR!!');
		// 		this.stageStart();
		// 		hero.heroUpgrade();
		// 	}else {
		// 		this.stageGuide('ALL CLEAR!!');
		// 	}
		// }
	}
}

class Hero {
	constructor(el){
		this.el = document.querySelector(el);
		this.movex = 0;
		this.speed = 11;
		this.direction = 'right';
		this.attackDamage = 10000000;
		this.hpProgress = 0;
		this.hpValue = 10000000000;
		this.defaultHpValue = this.hpValue;
		this.realDamage = 0;
		this.slideSpeed = 14;
		this.slideTime = 0;
		this.slideMaxTime = 30;
		this.slideDown = false;
		this.level = 1;
		this.exp = 0;
		this.maxExp = 3000;
		this.expProgress = 0;
		this.movey = 0;
		this.jumptimer = 0;
		this.jump_flag = 0;
		this.jump_speed = 10;
	}
	keyMotion(){
		if(key.keyDown['left']){
			this.direction = 'left';
			this.el.classList.add('run');
			this.el.classList.add('flip');

			this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;
		}else if(key.keyDown['right']){
			this.direction = 'right';
			this.el.classList.add('run');
			this.el.classList.remove('flip');

			this.movex = this.movex + this.speed;
		}

		if(key.keyDown['attack']){
			if(!bulletComProp.launch){
				this.el.classList.add('attack');
				bulletComProp.arr.push(new Bullet());

				bulletComProp.launch = true;
			}
		}

		if(key.keyDown['slide']){

			if(!this.slideDown){

				this.el.classList.add('slide');
				if(this.direction === 'right'){
					this.movex = this.movex + this.slideSpeed;
				}else{
					this.movex = this.movex - this.slideSpeed;
				}

				if(this.slideTime > this.slideMaxTime){
					this.el.classList.remove('slide');
					this.slideDown = true;
				}
				this.slideTime +=1;
			}
		}

		if(!key.keyDown['left'] && !key.keyDown['right']){
			this.el.classList.remove('run');
		}

		if(!key.keyDown['attack']){
			this.el.classList.remove('attack');
			bulletComProp.launch = false;
		}

		if(!key.keyDown['slide']){
			this.el.classList.remove('slide');
			this.slideDown = false;
			this.slideTime = 0;
		}

		if(key.keyDown['jump'] && this.jump_flag == 0){this.jump_flag = 1;}
		if(this.jump_flag == 1){			
			this.movey-= this.jump_speed;
			this.jumptimer++;
			if(this.jumptimer == 20){this.jump_flag = 2;}			
		}	
		if(this.jump_flag == 2){
			this.movey+= this.jump_speed;
			this.jumptimer--;
			if(this.jumptimer == 0){this.jump_flag = 0;}
		}

		this.el.parentNode.style.transform = `translate(${this.movex}px, ${this.movey}px)`;

		//hero움직일때의 구조물 충돌 효과 함수를 여기다 쓸게여;;;
		block.crashHero();
	}
	position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}
	size(){
		return{
			width: this.el.offsetWidth,
			height: this.el.offsetHeight
		}
	}
	minusHp(monsterDamage){
		this.hpValue = Math.max(0, this.hpValue - monsterDamage);
		this.crash();
		if(this.hpValue === 0){
			this.dead();
		}

		this.renderHp();
	}
	plusHp(hp){
		this.hpValue = hp;
		this.renderHp();
	}
	renderHp(){
		this.hpProgress = this.hpValue / this.defaultHpValue * 100
		const heroHpBox = document.querySelector('.state_box .hp span');
		heroHpBox.style.width = this.hpProgress + '%';
	}
	crash(){
		this.el.classList.add('crash');
		setTimeout(() => this.el.classList.remove('crash'), 400);
	}
	dead(){
		hero.el.classList.add('dead');
		endGame();
	}
	hitDamage(){
		this.realDamage = this.attackDamage - Math.round(Math.random() * this.attackDamage * 0.1);
	}
	heroUpgrade(){
		this.attackDamage += 5000;
	}
	updateExp(exp){
		this.exp += exp;
		this.expProgress = this.exp / this.maxExp * 100;
		document.querySelector('.hero_state .exp span').style.width = this.expProgress + '%';

		if(this.exp >= this.maxExp){
			this.levelUp();
		}
	}
	levelUp(){
		this.level += 1;
		this.exp = 0;
		this.maxExp = this.maxExp + this.level * 1000;
		document.querySelector('.level_box strong').innerText = this.level;
		const levelGuide = document.querySelector('.hero_box .level_up');
		levelGuide.classList.add('active');

		setTimeout(() => levelGuide.classList.remove('active'), 1000);
		this.updateExp(this.exp);
		this.heroUpgrade();
		this.plusHp(this.defaultHpValue);
	}

	box_crash() // hero 구조물 부딪혔을때 위치 조정, block클래스가 호출하고 있음
	{
		this.movey = block.position().top * -1.05;// -1.05값은 나도 모름 묻지 마셈 이렇게 하니깐 됨
	}
}

class Bullet{
	constructor(){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'hero_bullet';
		this.x = 0;
		this.y = 0;
		this.speed = 30;
		this.distance = 0;
		this.bulletDirection = 'right';
		this.init();
	}
	init(){
		this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
		this.x = this.bulletDirection === 'right' ? hero.movex + hero.size().width / 2 : hero.movex - hero.size().width / 2;

		this.y = (hero.position().bottom + hero.size().height / 2) * -1+30; // 수리검 점프해도  나갈수 있게 바꿈
		this.distance = this.x;
		this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
		this.parentNode.appendChild(this.el);
	}
	moveBullet(){
		let setRotate = '';
		if(this.bulletDirection === 'left'){
			this.distance -= this.speed;
			setRotate = 'rotate(180deg)';
		}else{
			this.distance += this.speed;
		}

		this.el.style.transform = `translate(${this.distance}px, ${this.y}px) ${setRotate}`;
		this.crashBullet();
	}
	position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}
	crashBullet(){ // 피격 범위 위 아래 까지 추가 완료
		for(let j = 0; j < allMonsterComProp.arr.length; j++){
			if(this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right){
				if(this.position().top < allMonsterComProp.arr[j].position().top && this.position().bottom > allMonsterComProp.arr[j].position().bottom)
					for(let i =0; i < bulletComProp.arr.length; i++){
						if(bulletComProp.arr[i] === this){
							hero.hitDamage();
							bulletComProp.arr.splice(i,1);
							this.el.remove();
							this.damageView(allMonsterComProp.arr[j]);
							allMonsterComProp.arr[j].updateHp(j);
						}
					}
				
			}
		}

		if(this.position().left > gameProp.screenWidth || this.position().right < 0){
			for(let i =0; i < bulletComProp.arr.length; i++){
				if(bulletComProp.arr[i] === this){
					bulletComProp.arr.splice(i,1);
					this.el.remove();
				}
			}
		}
	}
	damageView(monster){
		this.parentNode = document.querySelector('.game_app');
		this.textDamageNode = document.createElement('div');
		this.textDamageNode.className = 'text_damage';
		this.textDamage = document.createTextNode(hero.realDamage);
		this.textDamageNode.appendChild(this.textDamage);
		this.parentNode.appendChild(this.textDamageNode);
		let textPosition = Math.random() * -100;
		let damagex = monster.position().left + textPosition;
		let damagey = monster.position().top;

		this.textDamageNode.style.transform = `translate(${damagex}px,${-damagey}px)`
		setTimeout(() => this.textDamageNode.remove(), 500);
	}
}

class Monster {
	constructor(property, positionX){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'monster_box '+property.name;
		this.elChildren = document.createElement('div');
		this.elChildren.className = 'monster';
		this.hpNode = document.createElement('div');
		this.hpNode.className = 'hp';
		this.hpValue = property.hpValue;
		this.defaultHpValue = property.hpValue;
		this.hpInner = document.createElement('span');
		this.progress = 0;
		this.positionX = positionX;
		this.moveX = 0;
		this.speed = property.speed;
		this.crashDamage = property.crashDamage;
		this.score = property.score;
		this.exp = property.exp;

		this.init();
	}
	init(){
		this.hpNode.appendChild(this.hpInner);
		this.el.appendChild(this.hpNode);
		this.el.appendChild(this.elChildren);
		this.parentNode.appendChild(this.el);
		this.el.style.left = this.positionX + 'px';
	}
	position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}
	updateHp(index){
		this.hpValue = Math.max(0, this.hpValue - hero.realDamage);
		this.progress = this.hpValue / this.defaultHpValue * 100;
		this.el.children[0].children[0].style.width = this.progress + '%';

		if(this.hpValue === 0){
			this.dead(index);
		}
	}
	dead(index){
		this.el.classList.add('remove');
		setTimeout(() => this.el.remove(), 200);
		allMonsterComProp.arr.splice(index, 1);
		this.setScore();
		this.setExp();
	}
	moveMonster(){

		if(this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.movex <= 0){
			this.moveX = hero.movex - this.positionX + gameProp.screenWidth - hero.position().left;
		}else{
			this.moveX -= this.speed;
		}

		this.el.style.transform = `translateX(${this.moveX}px)`;
		this.crash();
	}
	crash(){
		let rightDiff = 30;
		let leftDiff = 90;
		if(hero.position().right-rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right){
			hero.minusHp(this.crashDamage);
		}
	}
	setScore(){
		stageInfo.totalScore += this.score;
		document.querySelector('.score_box').innerText = stageInfo.totalScore;
	}
	setExp(){
		hero.updateExp(this.exp);
	}
}

//캐릭터 충돌시 블록 위로 올라가기 구현해야 함(완료)
// 페럴릭스 완료
class Block{
	constructor(property){ // property먹힘 map.js에서 값 가져옴
		this.parentNode = document.querySelector('.game_app');
		this.el = document.createElement('div');
		this.el.className = property.name;
		this.movex = property.x;
		this.movey = property.y * -1;
		this.crash_box = 0;
		this.init();
	}
	init(){
		this.el.style.left = this.movex + 'px' 
		this.el.style.bottom = this.movey + 'px'
		this.parentNode.appendChild(this.el);
		
	}


	// 나중에 hero 부딪힐때 기능 구현
	crashHero()
	{	// 발이 구조물에 살짝 결쳐있어도 구조물 위에 있게 만듬
		if(hero.position().left+110 > this.position().left && hero.position().right-110 < this.position().right)
		{
			//console.log('left_right');
			if(hero.position().bottom > this.position().top-5 && hero.position().bottom < this.position().top+5 ) // hero가 점프에서 내려오는 중일때
			{
				if(hero.jump_flag)
				{
					this.crash_box = 1
					console.log('success');
					hero.box_crash();
				}
				
			}
			
		}
		else{
			// 오류 1. 구조물 끝에서 점프하다가 밖으로 나가면 땅으로 꺼짐(flag 조정해야 될듯)
			// 오류 2. 구조물 끝에서 점프하면 낮게 점프됨 (jump_flag를 변경해서 그럼)
			// 오류 3. 내 정신상태 살려줘 제발
			// 개선해야할 기능 : jumptimer값을 다이나믹하게 변경
			// 
			if(this.crash_box)
			{
				this.crash_box = 0;
				hero.jumptimer += 12;
				hero.jump_flag = 2;
			}
		}
	}

	// position값 추가 
	position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}

}


















