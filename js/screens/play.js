game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                // Tells the Level Director to Load Level01
                me.levelDirector.loadLevel("level01");

                // Pdulled an intsance of my players
                // Where he'll start
                var player = me.pool.pull("player",0, 0, {});
                 me.game.world.addChild(player, 5);
                // Added him to the world
                // The higher the number 5 is, the closer it will be to the front of the screen
				var gamemanager = me.pool.pull("GameManager", 0, 420, {});
				me.game.world.addChild(gamemanager, 0);

               


   				// Binded my right key
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindKey(me.input.KEY.LEFT, "left");
                me.input.bindKey(me.input.KEY.A, "attack");
               	me.input.bindKey(me.input.KEY.SPACE, "jump");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});
