var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
		window.plugins.NativeAudio.preloadSimple('backSfx', 'assets/audio/shakerBack.mp3', 
		null, function(msg){alert(msg);});
		
		window.plugins.NativeAudio.preloadSimple('frontSfx', 'assets/audio/shakerGentle.mp3', 
		null, function(msg){alert(msg);});
	
        game.load.image('circle', 'assets/images/shaker.png');
        game.load.image('bg', 'assets/images/bg.png');
    },
    
    create: function(){
        this.game.state.start("Shaker"); 
    }
};