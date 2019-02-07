var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.audio('shakerGentle', 'assets/audio/shakerGentle.ogg');
        game.load.audio('shakerStrong', 'assets/audio/shakerStrong.ogg');
        game.load.audio('shakerBack', 'assets/audio/shakerBack.ogg');
        game.load.image('circle', 'assets/circle.png');
    },
    
    create: function(){
        this.game.state.start("Shaker"); 
    }
};