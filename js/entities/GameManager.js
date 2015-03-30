game.GameTimerManager = Object.extend({
	// this is an object but we still need and init function
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();
		this.paused = false;
		this.alwaysUpdate = true;
		// player shouldnt get more gold if the game is paused
		
	},
	update: function() {
		 this.now = new Date().getTime();

		 this.goldTimerCheck();

		 this.creepTimerCheck();

		 return true;
	}, 

	goldTimerCheck: function() {
			 // creep is going to spawn at the same time the gold comes
		 if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)) {
			game.data.gold += game.data.exp1+1;
			console.log("Current gold: " + game.data.gold);
		 
		 };
	}, 
	creepTimerCheck: function() {

		 if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)) {
		 	// checking to see if we have multiples of ten
		 	// this.now - .. makes sure the spawn isnt repeating
		 	this.lastCreep = this.now;
		 	var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
		 	me.game.world.addChild(creepe, 5);
		 	var friend = me.pool.pull("FriendCreep", 200, 0, {});
		 	me.game.world.addChild(friend, 5);

		 };
	},

});
// this function is going to deal with the deaths
game.HeroDeathManager = Object.extend({
	init: function(x, y, settings){
		this.alwaysUpdate = true;
	},
	
	update: function() {
		 if(game.data.player.dead) {
		 	me.game.world.removeChild(game.data.player);
		 	me.state.current().resetPlayer(10, 0);

		 }
	}

});

game.ExperienceManager = Object.extend ({
	init: function(x, y, settings) {
		this.alwaysUpdate = true;
		this.gameover = false;
	},

	update: function() {
		// none of these get called until one of the flags are set 
		if(game.data.win === true && !this.gameover) {
		//this is going to do something if I win 
			this.gameOver(true);
		} 
		else if(game.data.win === false && !this.gameover) {
		// this will do something if I loose
			this.gameOver(false);
		}
		return true;
	}, 
	
	gameOver: function (win) {
		if (win) {
			game.data.exp += 10;
		}
		else {
			game.data.exp += 1;
		}
		

		this.gameover = true;
		me.save.exp = game.data.exp;
		// for testing code purposes
		console.log("Juzet is awesome " + me.save.exp);
		me.save.exp2 = 4;
	}
});

game.SpendGold = Object.extend ({
	init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastBuy = new Date().getTime();
		this.paused = false;
		this.alwaysUpdate = true;	
		this.updateWhenPaused = true;
		this.buying = false;
	},

	update: function() {
		this.now = new Date().getTime();
		
		if (me.input.isKeyPressed("buy") && this.now-this.lastBuy >= 1000) {
			this.lastBuy = this.now;
			if (!this.buying) {
				this.startBuying();
			}
			else {
				this.stopBuying();
			}

		}
		this.checkBuyKeys();

		return true;
	}, 
	startBuying: function () {
		this.buying = true;
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
		game.data.buyscreen.updateWhenPaused = true;
		game.data.buyscreen.setOpacity(0.8);
		me.game.world.addChild(game.data.buyscreen, 34);
		game.data.player.body.setVelocity(0, 0);
		me.state.pause(me.state.PLAY);
		me.input.bindKey(me.input.KEY.F1, "F1", true);
		me.input.bindKey(me.input.KEY.F2, "F2", true);
		me.input.bindKey(me.input.KEY.F3, "F3", true);
		me.input.bindKey(me.input.KEY.F4, "F4", true);
		me.input.bindKey(me.input.KEY.F5, "F5", true);
		me.input.bindKey(me.input.KEY.F6, "F6", true);
		// this is controlling the functions
		// this is also initiating functions
		this.setBuyText();
	},

	setBuyText: function () {
		game.data.buytext = new (me.Renderable.extend({
			init: function() {
				this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 1, 1]);
				//  300 50
				// making a call to the super function
				this.font = new me.Font("Arial", 26, "white");
				// setting a font on the screen
				this.updateWhenPaused = true;
				this.alwaysUpdate = true;
			}, 

            draw: function(renderer) {
				this.font.draw(renderer.getContext(), "PRESS F1-F6 TO BUY, B TO EXIT", this.pos.x, this.pos.y);
				// when we are drawing something we are passing in the context of where we are
				this.font.draw(renderer.getContext(), "Skill 1: Increase Damage. Current Level: " + game.data.skill1 + " Cost: " + ((game.data.skill1+1)*10), this.pos.x, this.pos.y + 40);
				this.font.draw(renderer.getContext(), "Skill 2: Run faster. Current Level: " + game.data.skill2 + " Cost: " + ((game.data.skill2+1)*10), this.pos.x, this.pos.y + 80);
				this.font.draw(renderer.getContext(), "Skill 3: Increase Health. Current Level: " + game.data.skill3 + " Cost: " + ((game.data.skill3+1)*10), this.pos.x, this.pos.y + 120);
				this.font.draw(renderer.getContext(), "Q Ability: Speed Burst. Current Level: " + game.data.ability1 + " Cost: " + ((game.data.ability1+1)*10), this.pos.x, this.pos.y + 160);
				this.font.draw(renderer.getContext(), "W Ability: Eat Creep for Health. Current Level: " + game.data.ability2 + " Cost: " + ((game.data.ability2+1)*10), this.pos.x, this.pos.y + 200);
				this.font.draw(renderer.getContext(), "E Ability: Throw your spear. Current Level: " + game.data.ability3+ " Cost: " + ((game.data.ability3+1)*10), this.pos.x, this.pos.y + 240);
			}   

		}));
		me.game.world.addChild(game.data.buytext, 35);

	},

	stopBuying: function () {
		this.buying = false;
		me.state.resume(me.state.PLAY);
		game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
		me.game.world.removeChild(game.data.buyscreen);
		me.input.unbindKey(me.input.KEY.F1, "F1", true);
		me.input.unbindKey(me.input.KEY.F2, "F2", true);
		me.input.unbindKey(me.input.KEY.F3, "F3", true);
		me.input.unbindKey(me.input.KEY.F4, "F4", true);
		me.input.unbindKey(me.input.KEY.F5, "F5", true);
		me.input.unbindKey(me.input.KEY.F6, "F6", true);
		me.game.world.removeChild(game.data.buytext);
		// these are stopping the functions
		// this is unbinding the functions for when you are not buying
	},

	checkBuyKeys: function() {
		if (me.input.isKeyPressed("F1")) {
			if(this.checkCost(1)){
				this.makePurchase(1);
			}
		}
		else if (me.input.isKeyPressed("F2")) {
			if(this.checkCost(2)){
				this.makePurchase(2);
			}
		}
		else if (me.input.isKeyPressed("F3")) {
			if(this.checkCost(3)){
				this.makePurchase(3);
			}
		}
		else if (me.input.isKeyPressed("F4")) {
			if(this.checkCost(4)){
				this.makePurchase(4);
			}
		}
		else if (me.input.isKeyPressed("F5")) {
			if(this.checkCost(5)){
				this.makePurchase(5);
			}
		}
		else if (me.input.isKeyPressed("F6")) {
			if(this.checkCost(6)){
				this.makePurchase(6);
			}
		}
	}, 
	
	checkCost: function(skill) {
		if(skill===1 && (game.data.gold >= ((game.data.skill1 + 1)*10))) {
			// taking the skill level adding 1 and multiplying it by 10 for the cost
			return true;
		}
		else if(skill===2 && (game.data.gold >= ((game.data.skill2 + 1)*10))) {
			// taking the skill level adding 1 and multiplying it by 0 for the cost
			return true;
		}
		else if(skill===3 && (game.data.gold >= ((game.data.skill3 + 1)*10))) {
			// taking the skill level adding 1 and multiplying it by 10 for the cost
			return true;
		}
		else if(skill===4 && (game.data.gold >= ((game.data.ability1 + 1)*10))) {
			// taking the skill level adding 1 and multiplying it by 10 for the cost
			return true;
		}
		else if(skill===5 && (game.data.gold >= ((game.data.ability2 + 1)*10))) {
			// taking the skill level adding 1 and multiplying it by 10 for the cost
			return true;
		}
		else if(skill===6 && (game.data.gold >= ((game.data.ability3 + 1)*10))) {
			// taking the skill level adding 1 and multiplying it by 10 for the cost
			return true;
		}
		else {
			return false;
		}
	},
	
	makePurchase: function(skill) {
		if(skill===1) {
			game.data.gold -= ((game.data.skill1 +1)*10);
			game.data.skill1 += 1;
			game.data.player.attack += 1; 
		}
		else if(skill===2) {
			game.data.gold -= ((game.data.skill2 +1)*10);
			game.data.skill2 += 1;
		}
		else if(skill===3) {
			game.data.gold -= ((game.data.skill3 +1)*10);
			game.data.skill3 += 1;
		}
		if(skill===4) {
			game.data.gold -= ((game.data.ability1 +1)*10);
			game.data.ability1 += 1;
		}
		if(skill===5) {
			game.data.gold -= ((game.data.ability2 +1)*10);
			game.data.ability2 += 1;
		}
		if(skill===6) {
			game.data.gold -= ((game.data.ability3 +1)*10);
			game.data.ability3 += 1;
		}
	}
});