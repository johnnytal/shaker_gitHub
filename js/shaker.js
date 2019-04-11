var shakerMain = function(game){
	FRONT_COLOR = '#c1ad65';
	BACK_COLOR = '#656d7c';	
	DEFAULT_COLOR = '#002255';

	resetTouching = true;

	aveAccel = 0;
	min_accel = 8;
	
	angle = 0;
	MIN_FRONT_ANGLE = 15;
	MIN_BACK_ANGLE = 3;
};

shakerMain.prototype = {
    create: function(){
		initVars();
 
		XtraUIbuttons();
		
	    debugTxtAngle = game.add.text(20, 5, "Angle" , {font: '21px', fill: 'white'});
	    debugTxtAccel = game.add.text(100, 5, "Accel" , {font: '21px', fill: 'lightgreen'});
	    
	    debugTxtHitAngle = game.add.text(20, 75, "Angle at hit" , {font: '21px', fill: 'white'});
	    debugTxtHitAccel = game.add.text(100, 75, "Accel at hit" , {font: '21px', fill: 'lightgreen'});

		try{window.addEventListener('deviceorientation', readAngle);} catch(e){}
		try{window.addEventListener('devicemotion', readAcc);} catch(e){}

		initPlugIns();
    }
};

function readAngle(event){	
	angle = roundIt(event.gamma);

	debugTxtAngle.text = 'Angle = ' + angle;
}

function readAcc(event){
	accelX = event.accelerationIncludingGravity.x;
	accelY = event.accelerationIncludingGravity.y;
	accelZ = event.accelerationIncludingGravity.z;
	
	aveAccel = roundIt((accelX + accelY + accelZ) / 3);
	
	debugTxtAccel.text = 'Accel = ' + aveAccel;
	
	if (angle > MIN_BACK_ANGLE + 1 && angle < MIN_FRONT_ANGLE - 1){
		resetTouching = true;
	}
	
	if (resetTouching){
		if (aveAccel > min_accel && MIN_FRONT_ANGLE >= angle){ // && current accel smaller then last accel
			frontSfx.play();
			flash(FRONT_COLOR);
		}
		else if (aveAccel < -min_accel && MIN_BACK_ANGLE <= angle){
			backSfx.play();
			flash(BACK_COLOR);
		}
	}	
}

function flash(_color){
	debugTxtHitAngle.text = angle;
	debugTxtHitAccel.text = aveAccel;
	
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
    	min_accel += 0.1;
    	frontText.text = "Accel: " + roundIt(min_accel);
    	plus.tint = 0xf04030;
    	setTimeout(function(){plus.tint = 0xffffff;},100);
    }, this);
    
    minus = game.add.sprite(525, 300, 'minus');
    minus.scale.set(.85, .85);
    minus.alpha = 0.85;
    minus.inputEnabled = true;
    minus.events.onInputDown.add(function(){
    	min_accel -= 0.1;
    	frontText.text = "Accel: " + roundIt(min_accel);
    	minus.tint = 0xf04030;
    	setTimeout(function(){minus.tint = 0xffffff;},100);
    }, this);
        
    frontText = game.add.text(545, 250, "min. accel: " + roundIt(min_accel),
    {font: '24px', fill: 'white'});
    
    /*
    plusD = game.add.sprite(620, 100, 'plus');
    plusD.inputEnabled = true;
    plusD.events.onInputDown.add(function(){
    	backAngle += 0.1;
    	backText.text = "BACK: " + roundIt(INIT_BACK + backAngle);
    	plusD.tint = 0xf04030;
    	setTimeout(function(){plusD.tint = 0xffffff;},100);
    }, this);
    
    minusD = game.add.sprite(525, 100, 'minus');
    minusD.inputEnabled = true;
    minusD.events.onInputDown.add(function(){
    	backAngle -= 0.1;
    	backText.text = "BACK: " + roundIt(INIT_BACK + backAngle);
    	minusD.tint = 0xf04030;
    	setTimeout(function(){minusD.tint = 0xffffff;},100);
    }, this);
	
    backText = game.add.text(545, 50, "BACK: " + roundIt(INIT_BACK + backAngle),
    {font: '24px', fill: 'white'});*/
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
    try{window.androidVolume.setMusic(15, false);} catch(e){} // max media volume
}