var shakerMain = function(game){
	FRONT_COLOR = '#ff00ff';
	BACK_COLOR = '#00ff00';	
	DEFAULT_COLOR = '#f7f7f7';
	LOGO_TINT = '0xff0000';

	aveAccel = 0;
	angle = 0;

	lastAccel = 0;
	lastAngle = 0;

	MIN_ACCEL_F = 0.8;
	MIN_ACCEL_B = 0.35;

	MIN_ANGLE_F = 0.35;
	MIN_ANGLE_B = 0;
	
	lastAction = 'FRONT';
};

shakerMain.prototype = {
    create: function(){
		game.stage.backgroundColor = DEFAULT_COLOR;
		
		bg = game.add.image(0, 0, 'bg');
		bg.alpha = 0.5;
		
		logo = game.add.image(0, 0, 'green');
        logo.x = WIDTH / 2 - logo.width / 2;
        logo.y =  HEIGHT / 2 - logo.height / 2;

		backSfx = game.add.audio('back');
		frontSfx = game.add.audio('front');

		try{window.addEventListener('deviceorientation', function(){
			angle = event.gamma;
		});} catch(e){}
		
		try{window.addEventListener('devicemotion', readAcc);} catch(e){}

		initPlugIns();
    }
};

function readAcc(event){
	var aveAccel = (
		event.accelerationIncludingGravity.x + 
		event.accelerationIncludingGravity.y +
		event.accelerationIncludingGravity.z
	) / 3;

	if (!frontSfx.isPlaying && !backSfx.isPlaying){
		if (Math.abs(lastAccel - aveAccel) > MIN_ACCEL_F && angle - lastAngle > MIN_ANGLE_F){ 
			if (lastAction == 'BACK'){
				frontSfx.play();
				flash(FRONT_COLOR);
				
				lastAction = 'FRONT';
			}
		}
		
		else if(Math.abs(lastAccel - aveAccel) > MIN_ACCEL_B && angle - lastAngle < MIN_ANGLE_B){	
			if (lastAction == 'FRONT'){
				backSfx.play();
				flash(BACK_COLOR);
				
				lastAction = 'BACK';
			}
		}
	}
	
	lastAngle = angle;
	lastAccel = aveAccel;
}

function flash(_color){
	if (_color == FRONT_COLOR){
		window.plugins.flashlight.switchOn();	
		navigator.vibrate(60);
	}
	else{
		navigator.vibrate(40);
	}
	
	game.stage.backgroundColor = _color;
	logo.tint = LOGO_TINT;

	setTimeout(function(){ // back to normal
		if (window.plugins.flashlight.isSwitchedOn()){
			window.plugins.flashlight.switchOff();
		}
		game.stage.backgroundColor = DEFAULT_COLOR;
		logo.tint = '0xffffff';
	}, 60);
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(100, false);} catch(e){} // max media volume
}