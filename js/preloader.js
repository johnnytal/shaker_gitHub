var preloader = function(game){};
 
preloader.prototype = {
    preload: function(){
        game.load.image('circle', 'assets/images/shaker.png');
        game.load.image('bg', 'assets/images/bg.png');
    },
    
    create: function(){
        this.game.state.start("Shaker"); 
    }
};