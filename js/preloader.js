var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.audio('shakerGentle', 'assets/audio/shakerGentle.mp3');
        game.load.audio('shakerStrong', 'assets/audio/shakerStrong.ogg');
        game.load.audio('shakerBack', 'assets/audio/shakerBack.mp3');
        game.load.audio('front', 'assets/audio/front.ogg');
        game.load.audio('back', 'assets/audio/back.ogg');
        game.load.image('circle', 'assets/images/shaker.png');
        game.load.image('bg', 'assets/images/bg.png');
    },
    
    create: function(){
        this.game.state.start("Shaker"); 
    }
};