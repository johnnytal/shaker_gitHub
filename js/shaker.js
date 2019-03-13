var shakerMain = function(game){
	GENTLE_COLOR = '#c1ad65';
	BACK_COLOR = '#656d7c';

	gamma = 0;
	accelX = 0;

	accelFactor = 57;
	gammaFactor = 730;
	ballFactor = 969;

	resetTouching = true;
};

shakerMain.prototype = {
	preload: function(){
		frontSfx = new Media('assets/audio/shakerGentle.mp3');
		backSfx = new Media('assets/audio/shakerBack.mp3');
	},
	
    create: function(){
    	bg = game.add.image(0, 0, 'bg');
    	bg.alpha = 0.6;
    	
        circles = game.add.group();
		circles.enableBody = true;
		circles.physicsBodyType = Phaser.Physics.ARCADE;
		
		circle = circles.create(0, 0, 'circle');
        circle.x = WIDTH / 2 - circle.width / 2;
        circle.y = HEIGHT / 2 - circle.height / 2;
        circle.scale.set(ballFactor/1000, ballFactor/1000);
 
        circle.body.collideWorldBounds = true;

		initPlugIns();
    },
    
    update: function(){
    	if (circle.y > 22 && circle.y < HEIGHT - circle.height - 22){
    		resetTouching = true;
    	}
    	
    	if (resetTouching){    	
	    	if (circle.y == 0){ // front
	    		frontSfx.play(); 
				flash(GENTLE_COLOR);	
    		}
	    	
	    	else if (circle.y == HEIGHT - circle.height){ // back    		
    			backSfx.play(); 
				flash(BACK_COLOR);
			}	
    	}
	}
};

function deviceMotion(event){
	accelX = roundIt(event.acceleration.x);
	circle.body.velocity.y = accelX * accelFactor;
}

function handleOrientation(event){
	gamma = roundIt(event.gamma);  // -90,90 X
	circle.body.gravity.y = (gamma * gammaFactor) * -1;
}

function flash(_color){
	resetTouching = false;

	game.stage.backgroundColor = _color;
	
	if (_color == GENTLE_COLOR){
		window.plugins.flashlight.switchOn();
	}

	setTimeout(function(){
		if (window.plugins.flashlight.isSwitchedOn()){
			window.plugins.flashlight.switchOff();
		}
		game.stage.backgroundColor = '#000000';
	}, 200);
}

function roundIt(_num){
	return Math.round(_num * 100) / 100;
}

function onError(e){
	alert('error: ' + e);
}

function onsuccess(){}

function initPlugIns(){
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', handleOrientation);
	}
	else{
		alert('orientation not supported');
	}
	
	if (window.DeviceMotionEvent) {
	  	window.addEventListener('devicemotion', deviceMotion);
	}
	else{
		alert('motion not supported');
	}

    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(100, false);} catch(e){} // max media volume
}