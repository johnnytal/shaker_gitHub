var shakerMain = function(game){
	FRONT_COLOR = '#ff00ff';
	BACK_COLOR = '#00ff00';	
	DEFAULT_COLOR = '#f7f7f7';

	aveAccel = 0;
	accelX = 0;
	accelY = 0;
	accelZ = 0;
	
	min_accel_front = 1.4;
	min_accel_back = 0.9;
	
	lastTenAccels = [];
	lastTenAngles = [];

	angle = 0;
	min_angle_front = 2.9;
	min_angle_back = 2.2;
	
	last_hit = '';
	
	min_time = 100;
	
	reset = true;
	
	modeGravity = false;

	backTimeOut = null;
};

shakerMain.prototype = {
    create: function(){
		game.stage.backgroundColor = DEFAULT_COLOR;

		backSfx = game.add.audio('back');
		frontSfx = game.add.audio('front');

	    debugTxtAngle = game.add.text(20, 15, "Angle" , {font: '22px', fill: 'darkgreen'});
	    debugTxtAccel = game.add.text(20, 45, "Accel" , {font: '22px', fill: 'darkgreen'});
 
	    debugTxtHitAngle = game.add.text(20, 85, "Angle at hit" , {font: '22px', fill: 'black'});
	    debugTxtHitAccel = game.add.text(20, 115, "Accel at hit" , {font: '22px', fill: 'black'});
	    
	    debugTxtLastHit = game.add.text(20, 215, "last hit" , {font: '22px', fill: 'blue'});
	    
	    debugTxtLastTenAccels = game.add.text(10, 335, "Accels:" ,{font: '22px', fill: 'darkblue'});
	    debugTxtLastTenAngles = game.add.text(10, 365, "Angles:" ,{font: '22px', fill: 'darkblue'});

		try{window.addEventListener('deviceorientation', readAngle);} catch(e){}
		try{window.addEventListener('devicemotion', readAcc);} catch(e){}

		XtraUIbuttons();
		initPlugIns();
    }
};

function readAngle(event){	
	angle = roundIt(event.gamma);

	debugTxtAngle.text = 'Angle: ' + angle;
	
	lastTenAngles.push(angle);
	if (lastTenAngles.length > 8) {
    	lastTenAngles.shift();
	}
}

function readAcc(event){
	if (!modeGravity){
		accelX = roundIt(event.acceleration.x);
		accelY = roundIt(event.acceleration.y);
		accelZ = roundIt(event.acceleration.z);
	}
	else{
		accelX = roundIt(event.accelerationIncludingGravity.x);
		accelY = roundIt(event.accelerationIncludingGravity.y);
		accelZ = roundIt(event.accelerationIncludingGravity.z);
	}
	
	aveAccel = roundIt((accelX + accelY + accelZ) / 3);

	if (!frontSfx.isPlaying && !backSfx.isPlaying && reset){
		if (Math.abs(lastTenAccels[lastTenAccels.length-1] - lastTenAccels[lastTenAccels.length-2]) > min_accel_front){ 
			if (lastTenAngles[lastTenAngles.length-1] - lastTenAngles[lastTenAngles.length-2] > min_angle_front){ 
				frontSfx.play();
				
				last_hit = 'FRONT';
				flash(FRONT_COLOR);	
			}
		}
		
		else if(Math.abs(lastTenAccels[lastTenAccels.length-1] - lastTenAccels[lastTenAccels.length-2]) > min_accel_back){
			if (lastTenAngles[lastTenAngles.length-1] - lastTenAngles[lastTenAngles.length-2] < -min_angle_back){
				backSfx.play();
				
				last_hit = 'BACK';
				flash(BACK_COLOR);
			}
		}
	}
	
	debugTxtAccel.text = 'Accel: ' + aveAccel;
	
	lastTenAccels.push(aveAccel);
	if (lastTenAccels.length > 8) {
    	lastTenAccels.shift();
	}	
}

function flash(_color){
	reset = false;
	
	try{clearTimeout(resetTimeOut);}catch(e){};
	
	resetTimeOut = setTimeout(function(){
		reset = true;
	}, min_time);
	
	debugTxtHitAngle.text = 'Angle at hit: ' + angle;
	debugTxtHitAccel.text = 'Accel at hit: ' + aveAccel + '\n(X: ' + accelX + ',  Y: ' + accelY + '\n,  Z: ' + accelZ + ')';;
	
	debugTxtLastHit.text = 'Last hit: ' + last_hit;
	
	debugTxtLastTenAccels.text = 'Accels: ' + lastTenAccels.join(', ');
	debugTxtLastTenAngles.text = 'Angles: ' + lastTenAngles.join(', ');

	game.stage.backgroundColor = _color;

	if (_color == FRONT_COLOR){
		window.plugins.flashlight.switchOn();	
	}
	
	navigator.vibrate(40);

	setTimeout(function(){ // back to normal
		if (window.plugins.flashlight.isSwitchedOn()){
			window.plugins.flashlight.switchOff();
		}
		
		game.stage.backgroundColor = DEFAULT_COLOR;
	}, 75);
}

function XtraUIbuttons(){
    plus = game.add.sprite(620, 240, 'plus');
    plus.inputEnabled = true;
    plus.events.onInputDown.add(function(){
    	min_accel_front += 0.05;
    	backText.text = "accel front: " + roundIt(min_accel_front);
    	plus.tint = 0xf04030;
    	setTimeout(function(){plus.tint = 0xffffff;}, 100);
    }, this);
    
    minus = game.add.sprite(525, 240, 'minus');
    minus.inputEnabled = true;
    minus.events.onInputDown.add(function(){
    	min_accel_front -= 0.05;
    	backText.text = "accel front: " + roundIt(min_accel_front);
    	minus.tint = 0xf04030;
    	setTimeout(function(){minus.tint = 0xffffff;}, 100);
    }, this);
    
    backText = game.add.text(540, 190, "accel front: " + roundIt(min_accel_front),
    {font: '22px', fill: 'black'});

    plusD = game.add.sprite(620, 80, 'plus');
    plusD.inputEnabled = true;
    plusD.events.onInputDown.add(function(){
    	min_angle_front += 0.05;
    	frontText.text = "angle front: " + roundIt(min_angle_front);
    	plusD.tint = 0xf04030;
    	setTimeout(function(){plusD.tint = 0xffffff;}, 100);
    }, this);
    
    minusD = game.add.sprite(525, 80, 'minus');
    minusD.inputEnabled = true;
    minusD.events.onInputDown.add(function(){
    	min_angle_front -= 0.05;
    	frontText.text = "angle front: " + roundIt(min_angle_front);
    	minusD.tint = 0xf04030;
    	setTimeout(function(){minusD.tint = 0xffffff;}, 100);
    }, this);
	
    frontText = game.add.text(540, 30, "angle front: " + roundIt(min_angle_front),
    {font: '22px', fill: 'black'});
    
    ///////
    
    plus2 = game.add.sprite(320, 240, 'plus');
    plus2.inputEnabled = true;
    plus2.events.onInputDown.add(function(){
    	min_accel_back += 0.05;
    	backText2.text = "accel back: " + roundIt(min_accel_back);
    	plus2.tint = 0xf04030;
    	setTimeout(function(){plus2.tint = 0xffffff;}, 100);
    }, this);
    
    minus2 = game.add.sprite(225, 240, 'minus');
    minus2.inputEnabled = true;
    minus2.events.onInputDown.add(function(){
    	min_accel_back -= 0.05;
    	backText2.text = "accel back: " + roundIt(min_accel_back);
    	minus2.tint = 0xf04030;
    	setTimeout(function(){minus2.tint = 0xffffff;}, 100);
    }, this);
        
    backText2 = game.add.text(240, 190, "accel back: " + roundIt(min_accel_back),
    {font: '22px', fill: 'black'});

    plusD2 = game.add.sprite(320, 80, 'plus');
    plusD2.inputEnabled = true;
    plusD2.events.onInputDown.add(function(){
    	min_angle_back += 0.05;
    	frontText2.text = "angle back: " + roundIt(min_angle_back);
    	plusD2.tint = 0xf04030;
    	setTimeout(function(){plusD2.tint = 0xffffff;}, 100);
    }, this);
    
    minusD2 = game.add.sprite(225, 80, 'minus');
    minusD2.inputEnabled = true;
    minusD2.events.onInputDown.add(function(){
    	min_angle_back -= 0.05;
    	frontText2.text = "angle back: " + roundIt(min_angle_back);
    	minusD2.tint = 0xf04030;
    	setTimeout(function(){minusD2.tint = 0xffffff;}, 100);
    }, this);
	
    frontText2 = game.add.text(240, 30, "angle back: " + roundIt(min_angle_back),
    {font: '22px', fill: 'black'});
    
    
    ///
    
    
    plusTime = game.add.sprite(465, 165, 'plus');
    plusTime.scale.set(.8,.8);
    plusTime.inputEnabled = true;
    plusTime.events.onInputDown.add(function(){
    	min_time += 10;
    	timeMin.text = "time: " + roundIt(min_time);
    	plusTime.tint = 0xf04030;
    	setTimeout(function(){plusTime.tint = 0xffffff;}, 100);
    }, this);
    
    minusTime = game.add.sprite(385, 165, 'minus');
    minusTime.scale.set(.8,.8);
    minusTime.inputEnabled = true;
    minusTime.events.onInputDown.add(function(){
    	min_time -= 10;
    	timeMin.text = "time: " + roundIt(min_time);
    	minusTime.tint = 0xf04030;
    	setTimeout(function(){minusTime.tint = 0xffffff;}, 100);
    }, this);
	
    timeMin = game.add.text(410, 125, "time: " + roundIt(min_time),
    {font: '22px', fill: 'black'});
    
    
    ///


    modeGravityBtn = game.add.sprite(425, 15, 'minus');
    modeGravityBtn.tint = 0xf42a1a;
    modeGravityBtn.scale.set(.75,.75);
    modeGravityBtn.inputEnabled = true;
    modeGravityBtn.events.onInputDown.add(function(){
    	if (!modeGravity){
    		modeGravity = true;
    		modeGravityBtn.tint = 0xffff2f;
    	}
    	else{
    		modeGravity = false;
    		modeGravityBtn.tint = 0xf42a1a;
    	}
    	
    	gravTxt.text = "Gravity: " + modeGravity;
    	
    }, this);
    
    gravTxt = game.add.text(415, 80, "Gravity: " + modeGravity,
    {font: '16px', fill: 'red'});
}

function roundIt(_num){
	return Math.round(_num * 100) / 100;
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(10, false);} catch(e){} // max media volume
}