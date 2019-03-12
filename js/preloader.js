var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
		window.plugins.NativeAudio.preloadComplex('frontSfx', 'assets/audio/shakerGentle.mp3',  1, 1, 0, 
		null, function(msg){alert(msg);});
			
		window.plugins.NativeAudio.preloadComplex('backSfx', 'assets/audio/shakerBack.mp3',  1, 1, 0, 
		null, function(msg){alert(msg);});
	
        game.load.image('circle', 'assets/images/shaker.png');
        game.load.image('bg', 'assets/images/bg.png');
    },
    
    create: function(){
        this.game.state.start("Shaker"); 
    }
};