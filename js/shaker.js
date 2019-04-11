var shakerMain = function(game){
	FRONT_COLOR = '#c1ad65';
	BACK_COLOR = '#656d7c';	
	DEFAULT_COLOR = '#002255';

	resetTouching = true;

	aveAccel = 0;
	accelX = 0;
	accelY = 0;
	accelZ = 0;
	
	min_accel_front = 2.6;
	min_accel_back = -5.2;

	angle = 0;
	MIN_FRONT_ANGLE = 18;
	MIN_BACK_ANGLE = 8;
};

shakerMain.prototype = {
    create: function(){
		initVars();
 
		XtraUIbuttons();
		
	    debugTxtAngle = game.add.text(20, 15, "Angle" , {font: '21px', fill: 'white'});
	    debugTxtAccel = game.add.text(20, 45, "Accel" , {font: '21px', fill: 'lightgreen'});
	    
	    debugTxtHitAngle = game.add.text(20, 85, "Angle at hit" , {font: '21px', fill: 'white'});
	    debugTxtHitAccel = game.add.text(20, 115, "Accel at hit" , {font: '21px', fill: 'lightgreen'});

		try{window.addEventListener('deviceorientation', readAngle);} catch(e){}
		try{window.addEventListener('devicemotion', readAcc);} catch(e){}

		initPlugIns();
    }
};

function readAngle(event){	
	angle = roundIt(event.gamma);

	debugTxtAngle.text = 'Angle: ' + angle + '  (min front ' + MIN_FRONT_ANGLE + ', min back ' + MIN_BACK_ANGLE + ')';
}

function readAcc(event){
	accelX = roundIt(event.acceleration.x);
	accelY = roundIt(event.acceleration.y);
	accelZ = roundIt(event.acceleration.z);
	
	aveAccel = roundIt((accelX + accelY + accelZ) / 3);
	
	debugTxtAccel.text = 'Accel: ' + Math.round(aveAccel * 10) / 10;
	'  (X: ' + Math.round(accelX) + ',  Y: ' + Math.round(accelY) + ',  Z: ' + Math.round(accelZ) + ')';
	
	if (angle > MIN_BACK_ANGLE + 1 && angle < MIN_FRONT_ANGLE - 1){
		resetTouching = true;
	}
	
	if (resetTouching && !frontSfx.isPlaying && !backSfx.isPlaying){
		if (aveAccel < min_accel_back && MIN_BACK_ANGLE <= angle){ // && current accel smaller then last accel
			frontSfx.play();
			flash(FRONT_COLOR);
		}
		else if (aveAccel > min_accel_front && MIN_FRONT_ANGLE >= angle){
			backSfx.play();
			flash(BACK_COLOR);
		}
	}	
}

function flash(_color){
	debugTxtHitAngle.text = 'Angle at hit: ' + angle;
	debugTxtHitAccel.text = 'Accel at hit: ' + aveAccel + '  (X: ' + accelX + ',  Y: ' + accelY + ',  Z: ' + accelZ + ')';;
	
	resetTouching = false;
	
	game.stage.backgroundColor = _color;
	circle.tint = 0xff00df;

	if (_color == FRONT_COLOR){
		window.plugins.flashlight.switchOn();	
	}
	
	navigator.vibrate(22);

	setTimeout(function(){ // back to normal
		if (window.plugins.flashlight.isSwitchedOn()){
			window.plugins.flashlight.switchOff();
		}
		
		circle.tint = 0xffffff;
		game.stage.backgroundColor = DEFAULT_COLOR;
	}, 75);
}

function XtraUIbuttons(){
    plus = game.add.sprite(620, 300, 'plus');
    plus.scale.set(.85, .85);
    plus.alpha = 0.85;
    plus.inputEnabled = true;
    plus.events.onInputDown.add(function(){
    	min_accel_back += 0.05;
    	backText.text = "accel back: " + roundIt(min_accel_back);
    	plus.tint = 0xf04030;
    	setTimeout(function(){plus.tint = 0xffffff;}, 100);
    }, this);
    
    minus = game.add.sprite(525, 300, 'minus');
    minus.scale.set(.85, .85);
    minus.alpha = 0.85;
    minus.inputEnabled = true;
    minus.events.onInputDown.add(function(){
    	min_accel_back -= 0.05;
    	backText.text = "accel back: " + roundIt(min_accel_back);
    	minus.tint = 0xf04030;
    	setTimeout(function(){minus.tint = 0xffffff;}, 100);
    }, this);
        
    backText = game.add.text(540, 250, "accel back: " + roundIt(min_accel_back),
    {font: '24px', fill: 'white'});

    plusD = game.add.sprite(620, 100, 'plus');
    plusD.inputEnabled = true;
    plusD.events.onInputDown.add(function(){
    	min_accel_front += 0.05;
    	frontText.text = "accel front: " + roundIt(min_accel_front);
    	plusD.tint = 0xf04030;
    	setTimeout(function(){plusD.tint = 0xffffff;}, 100);
    }, this);
    
    minusD = game.add.sprite(525, 100, 'minus');
    minusD.inputEnabled = true;
    minusD.events.onInputDown.add(function(){
    	min_accel_front -= 0.05;
    	frontText.text = "accel front: " + roundIt(min_accel_front);
    	minusD.tint = 0xf04030;
    	setTimeout(function(){minusD.tint = 0xffffff;}, 100);
    }, this);
	
    frontText = game.add.text(545, 50, "accel front: " + roundIt(min_accel_front),
    {font: '24px', fill: 'white'});
}

function initVars(){
	game.stage.backgroundColor = DEFAULT_COLOR;

    backSfx = game.add.audio('back');
	frontSfx = game.add.audio('front'); 

	circle = game.add.image(0, 0, 'circle');
    circle.x = WIDTH / 2 - circle.width / 2;
    circle.y = HEIGHT / 2 - circle.height / 2;
}

function roundIt(_num){
	return Math.round(_num * 100) / 100;
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(10, false);} catch(e){} // max media volume
}