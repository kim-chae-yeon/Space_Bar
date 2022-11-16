class Stage {
	constructor(){
		this.level = 0;
		this.isStart = false;
		this.portal_flag = false;
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

		stageUrl = ("../../../lib/images/background/stage2_image.jpg")

		this.parentNode.style.backgroundImage = "url('"+stage1Url+"')"

		setTimeout(() => this.textBox.remove(), 9999);
	}

	callMonster(){		
		//allMonsterComProp.arr[0] = new Monster(stageInfo.monster[0].bossMon, gameProp.screenWidth);		
		allMonsterComProp.arr[0] = new Monster(stageInfo.monster[0].defaultMon, 450, 270 , Math.floor(Math.random() * 1000));
		allMonsterComProp.arr[1] = new Monster(stageInfo.monster[0].defaultMon, 1250, 330, Math.floor(Math.random() * 1000));
		allMonsterComProp.arr[2] = new Monster(stageInfo.monster[0].defaultMon, 2150, 290, Math.floor(Math.random() * 1000));
		allMonsterComProp.arr[3] = new Monster(stageInfo.monster[0].defaultMon, 1000, 30,  Math.floor(Math.random() * 1000));	
		allMonsterComProp.arr[4] = new Monster(stageInfo.monster[0].defaultMon, 2000, 30,  Math.floor(Math.random() * 1000));	
	}
	
	clearCheck(){
		stageInfo.callPosition.forEach( arr => {
			if(allMonsterComProp.arr.length === 0){ //&& hero.movex > arr){		//잠시 call포지션 주석처리					
				stageInfo.callPosition.shift();		
				this.callMonster();
				this.level++;		
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
		this.speed = 8;
		this.direction = 'right';
		this.attackDamage = 1;
		this.hpProgress = 0;
		this.hpValue = 10;
		this.defaultHpValue = this.hpValue;
		this.realDamage = 0;
		this.slideSpeed = 5;
		this.slideTime = 0;
		this.slideMaxTime = 30;
		this.slideDown = false;
		this.level = 1;
		this.exp = 0;
		this.maxExp = 10;
		this.expProgress = 0;
		this.movey = 0;
		this.jumptimer = 0;
		this.jump_flag = 0;
		this.jump_speed = 8;
		this.jump_height = 30; // 점프 높이 변수 추가
		this.wall_flag = 0; // wall_flag변수 추가 캐릭터가 바닥이면 0 구조물이면 1로 할 예정
		this.error_jump = 0; // 더블 점프를 막기 위한 변수
	}
	keyMotion(){
		if(key.keyDown['esc']){
			window.location.replace('/');
		}
		var stageUrl = ("../../../lib/images/background/stage1_image.jpg")
		//포탈 키 눌렀을때 바뀌는 거 수정해야함
		if(this.movex === 3000 && this.level >= 3){
			if(key.keyDown['portal']){
				stageInfo.portal_flag = true;
				// stageInfo.nextStage()
			}
			document.querySelector('.game_app').style.backgroundImage = "url('"+stageUrl+"')"
		}
		if(key.keyDown['left']){
			this.direction = 'left';
			this.el.classList.add('run');
			this.el.classList.add('flip');
			this.movex = this.movex <= 0 ? 0 : this.movex - this.speed;

		}else if(key.keyDown['right']){
			this.direction = 'right';
			this.el.classList.add('run');
			this.el.classList.remove('flip');
			this.movex = this.movex >= 3000 ? 3000 : this.movex + this.speed;
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
					this.movex = this.movex >= 3000 ? 3000 : this.movex + this.slideSpeed;
				}else{
					this.movex = this.movex <= 0 ? 0 : this.movex - this.slideSpeed;

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

		if(key.keyDown['jump'] && this.jump_flag == 0 && !this.error_jump){
			this.jump_flag = 1;
			this.el.classList.add('jump');
		}
		if(this.jump_flag == 1 ){			 // 올라갈때
			this.movey-= this.jump_speed;
			this.jumptimer++;
			if(this.jumptimer == this.jump_height){this.jump_flag = 2;} // 정점			
		}	
		if(this.jump_flag == 2){ // 내려올때
			this.movey+= this.jump_speed;
			this.jumptimer--;
			if(this.jumptimer < 1){
				{this.jump_flag = 0;
				this.el.classList.remove('jump');
				}
			}
		}

		if(this.jump_flag == 0 && this.movey < 0) //점프가 끝났으나 공중에 멈춰있는 경우의 예외처리 코드		
		{
			if(!this.wall_flag)
			{		
				this.error_jump = 1; 
				if(this.movey != 0)
				{this.movey+= this.jump_speed;}
				else if(this.movey == 0)
				{this.error_jump = 0;}
					
			}
			else{this.error_jump = 0;}
		}
		
		if(this.movey > 0) // 땅에 떨어졌을떄 약간의 떠있는 값 예외처리
		{this.movey = 0; this.error_jump = 0;}
		this.el.parentNode.style.transform = `translate(${this.movex}px, ${this.movey}px)`;

		//hero움직일때의 구조물 충돌 효과 함수를 여기다 쓸게여;;;
		this.box_crash_Hero(blockComProp.arr);
		this.box_not_crash_Hero(blockComProp.arr);

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
		this.attackDamage += 1;
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
		this.maxExp = this.maxExp + this.level * 2;
		document.querySelector('.level_box strong').innerText = this.level;
		const levelGuide = document.querySelector('.hero_box .level_up');
		levelGuide.classList.add('active');

		setTimeout(() => levelGuide.classList.remove('active'), 1000);
		this.updateExp(this.exp);
		this.heroUpgrade();
		this.plusHp(this.defaultHpValue);
	}

	box_crash(block_data) // hero 구조물 부딪혔을때 위치 조정, block클래스가 호출하고 있음
	{
		this.wall_flag = 1
		this.movey = block_data.position().top * -0.90;
	}

	box_not_crash_Hero(block_data) // 충돌 제거 기능
	{
		let  flag = 0;
		for(let i=0;i<block_data.length;i++)
			{
			if(this.position().left+110 > block_data[i].position().left && this.position().right-110 < block_data[i].position().right)
				{			
						flag = 1;		
				}
			}
		if(!flag)
		{this.wall_flag = 0;}
		
	}

	box_crash_Hero(block_data)
	{	// 발이 구조물에 살짝 결쳐있어도 구조물 위에 있게 만듬
		for(let i=0;i<block_data.length;i++)
		{
		if(this.position().left+110 > block_data[i].position().left && this.position().right-110 < block_data[i].position().right)
			{
			//console.log('left_right');
				if(this.position().bottom > block_data[i].position().top-10 && this.position().bottom < block_data[i].position().top+10 ) // hero가 점프에서 내려오는 중일때
				{
					//if(this.jump_flag)
					{						
						this.box_crash(block_data[i]);
					}

				}
			
			}
		}
		
	}
}

class Bullet{
	constructor(){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'hero_bullet';
		this.x = 0;
		this.y = 0;
		this.speed = 20;
		this.distance = 0;
		this.maxdistance = 500;
		this.mindistance = -500;
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

		
		var rockUrl = ("../../../lib/images/weapon/Rock2.png")
		this.el.style.backgroundImage = "url('"+rockUrl+"')"
		this.el.style.height = "64px"
	}
	moveBullet(){
		let setRotate = '';
		if(this.bulletDirection === 'left'){
			this.distance -= this.speed;
			setRotate = 'rotate(180deg)';
			if(this.distance <= hero.movex-600){
				this.el.remove()
			}

		}else{
			this.distance += this.speed;
			if(this.distance >= hero.movex+600){
				this.el.remove()
			}
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
	constructor(property, positionX, positionY, random_time){
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
		this.positionY = positionY;
		this.movex = 0;
		this.speed = property.speed;
		this.crashDamage = property.crashDamage;
		this.score = property.score;
		this.exp = property.exp;
		this.move_flag = 0;
		this.move_count = 50;
		this.wait_count = 0;
		this.wait_flag = 1;
		this.random_time = random_time;
		this.setRotate = '';
		setTimeout(() => this.init(), 500);
		//this.init();
	}

	init(){
		this.hpNode.appendChild(this.hpInner);
		this.el.appendChild(this.hpNode);
		this.el.appendChild(this.elChildren);
		this.parentNode.appendChild(this.el);
		this.el.style.left = this.positionX + 'px';
		this.el.style.bottom = this.positionY + 'px'
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
		if(this.wait_flag)
		{
			
			setTimeout(() => this.wait_count += 1, this.random_time);
			if(this.wait_count > 10)
			{
				
				this.wait_count = 0;
				this.wait_flag = 0;
				
			}
		}
		
		if(this.move_flag == 0 && !this.wait_flag)
		{
			this.setRotate = 'scaleX(1)';
			setTimeout(() => this.movex -= this.speed , 500);
			this.move_count += 1;
			if(this.move_count > 100)
			{this.move_flag = 1; this.wait_flag = 1;}
			
		}
		
		if(this.move_flag == 1 && !this.wait_flag)
		{
			
			this.setRotate = 'scaleX(-1)';
			setTimeout(() => this.movex += this.speed, 500);
			this.move_count -= 1;
			if(this.move_count < 0)
			{this.move_flag = 0; this.wait_flag = 1;}
			
			
		}
		this.el.style.transform = `translate(${this.movex}px) ${this.setRotate}`;
		this.crash();
	}

	crash(){
		let rightDiff = 30;
		let leftDiff = 90;
		if(hero.position().right-rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right){
			if(hero.position().bottom+10 < this.position().top && hero.position().top > this.position().bottom)
			{
				hero.minusHp(this.crashDamage);
			}
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

class Block{
	constructor(property){ 
		this.parentNode = document.querySelector('.game_app');
		this.el = document.createElement('div');
		this.el.className = property.name;
		this.movex = property.x;
		this.movey = property.y * -1;
		this.crash_box = 0
		this.init();
	}

	init(){
		this.el.style.left = this.movex + 'px' 
		this.el.style.bottom = this.movey + 'px'
		this.parentNode.appendChild(this.el);		
	}

	position(){
		return{
			left: this.el.getBoundingClientRect().left,
			right: this.el.getBoundingClientRect().right,
			top: gameProp.screenHeight - this.el.getBoundingClientRect().top,
			bottom: gameProp.screenHeight - this.el.getBoundingClientRect().top - this.el.getBoundingClientRect().height
		}
	}

}

















