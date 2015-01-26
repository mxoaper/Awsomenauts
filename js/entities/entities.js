game.PlayerEntity = me.Entity.extend({

	init: function(x, y, settings){
			// 
			this._super(me.Entity,  'init', [x, y, {
				image: "player",
				// Image has a width of 64
				width: 64,
				// Images has a height of 64
				height:64,
				// These Two are passing the main information
				spritewidth:"64",
				spriteheight:"64",
				// Returns a new shape, a rectangle. What the little guy could walk into.
				// Turned it into a polygon with .toPolygon
				getShape: function(){
					return(new me.Rect(0, 0, 64, 64)) .toPolygon();
				}
			}])
	},

	update: function(){

	}
});