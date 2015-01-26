game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                // Tells the Level Director to Load Level01
                me.levelDirector.loadLevel("level01");

                // Pulled an intsance of my player
                // Where he'll start
                var player = me.pool.pull("player",0, 420, {});
                // Added him to the world
                // The higher the number 5 is, the closer it will be to the front of the screen
                me.game.world.addChild(player, 5);

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
