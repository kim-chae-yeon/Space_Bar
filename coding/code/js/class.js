class Hero {
	constructor(el){
		this.el = document.querySelector(el);
		this.movex = 0;
		this.movey = 0;
		this.speed = 5;
		this.direction = 'right';
		this.attackDamage = 10000;
		this.hpProgress = 0;
		this.hpValue = 10000;
		this.defaultHpValue = this.hpValue;
		this.realDamage = 0;
		this.jumptimer = 0;
		this.jump_flag = 0;
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

	
	
		if(!key.keyDown['left'] && !key.keyDown['right']){
			this.el.classList.remove('run');
		}

		if(!key.keyDown['attack']){
			this.el.classList.remove('attack');
			bulletComProp.launch = false;
		}



		if(key.keyDown['jump'] && this.jump_flag == 0){this.jump_flag = 1;}
		if(this.jump_flag == 1){			
			this.movey-=5;
			this.jumptimer++;
			if(this.jumptimer == 20){this.jump_flag = 2;}			
		}	
		if(this.jump_flag == 2){
			this.movey+=5;
			this.jumptimer--;
			if(this.jumptimer == 0){this.jump_flag = 0;}
		}

		this.el.parentNode.style.transform = `translate(${this.movex}px, ${this.movey}px)`;
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
	updateHp(monsterDamage){
		this.hpValue = Math.max(0, this.hpValue - monsterDamage);
		this.hpProgress = this.hpValue / this.defaultHpValue * 100
		const heroHpBox = document.querySelector('.state_box .hp span');
		heroHpBox.style.width = this.hpProgress + '%';
		this.crash();
		if(this.hpValue === 0){
			this.dead();
		}
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
}

class Bullet{
	constructor(){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'hero_bullet';
		this.x = 0;
		this.y = 0;
		this.speed = 10;
		this.distance = 0;
		this.bulletDirection = 'right';
		this.init();
	}
	init(){
		this.bulletDirection = hero.direction === 'left' ? 'left' : 'right';
		this.x = this.bulletDirection === 'right' ? hero.movex + hero.size().width / 2 : hero.movex - hero.size().width / 2;

		this.y = hero.position().bottom * -1;
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
	crashBullet(){

		for(let j = 0; j < allMonsterComProp.arr.length; j++){
			if(this.position().left > allMonsterComProp.arr[j].position().left && this.position().right < allMonsterComProp.arr[j].position().right){
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
	constructor(positionX, hp){
		this.parentNode = document.querySelector('.game');
		this.el = document.createElement('div');
		this.el.className = 'monster_box';
		this.elChildren = document.createElement('div');
		this.elChildren.className = 'monster';
		this.hpNode = document.createElement('div');
		this.hpNode.className = 'hp';
		this.hpValue = hp;
		this.defaultHpValue = hp;
		this.hpInner = document.createElement('span');
		this.progress = 0;
		this.positionX = positionX;
		this.moveX = 0;
		this.speed = 2;
		this.crashDamage = 100;

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
	}
	moveMonster(){
		if(this.moveX + this.positionX + this.el.offsetWidth + hero.position().left - hero.movex <= 0){
			this.moveX = hero.movex - this.positionX + gameProp.screenWidth - hero.position().left;
		}else{
			let temp = Math.floor(Math.random() * 3)+1
			
			if(temp === 1){this.moveX -= this.speed; this.el.classList.remove('flip');} // flip이 안댐
		    if(temp === 2){this.moveX += this.speed; this.el.classList.add('flip');} // flip이 안댐

		}

		this.el.style.transform = `translate(${this.moveX}px)`;
		this.crash();
	}
	crash(){
		let rightDiff = 30;
		let leftDiff = 90;
		if(hero.position().right-rightDiff > this.position().left && hero.position().left + leftDiff < this.position().right){
			hero.updateHp(this.crashDamage);
		}
	}
}

// 캐릭터와  충돌시 블록 위로 올라가기 구현해야 함
class Block{
	constructor(){}
	init(){}
}

//포탈 입장시 새로운 맵 로드
class Portal{
	constructor(){}
	init(){}
}

//마지막 nft 거래소 로드 --- 게빌 마지막쯤 로드
class NFT_npc{
	constructor(){}
	init(){}
}

//db랑 연결은 2학기때 
class Inventory{
	constructor(){}
	init(){}
}
















