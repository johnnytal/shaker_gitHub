var shakerMain = function(game){
	FRONT_COLOR = '#ff00ff';
	BACK_COLOR = '#00ff00';	
	DEFAULT_COLOR = '#f7f7f7';

	aveAccel = 0;
	accelX = 0;
	accelY = 0;
	accelZ = 0;
	
	min_accel_front = 0.8;
	min_accel_back = 0.35;
	
	lastfiveAccels = [];
	lastfiveAngles = [];

	angle = 0;
	min_angle_front = 0.35;
	min_angle_back = 0;
	
	min_abs_angle_front = 0;
	min_abs_angle_back = 0;
	
	min_abs_accel_front = 0;
	min_abs_accel_back = 0;
	
	last_hit = 'FRONT';
	
	min_time = 250;
	
	reset = true;
	
	modeGravity = true;
	modeOneWay = false;
	modeAbsAngle = false;
	modeAbsAccel = false;

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
	    
	    debugTxtLastfiveAccels = game.add.text(10, 335, "Accels:" ,{font: '22px', fill: 'darkblue'});
	    debugTxtLastfiveAngles = game.add.text(10, 365, "Angles:" ,{font: '22px', fill: 'darkblue'});

		try{window.addEventListener('deviceorientation', readAngle);} catch(e){}
		try{window.addEventListener('devicemotion', readAcc);} catch(e){}

		XtraUIbuttons();
		initPlugIns();
    }
};

function readAngle(event){	
	angle = roundIt(event.gamma);

	debugTxtAngle.text = 'Angle: ' + angle;
	
	lastfiveAngles.push(angle);
	if (lastfiveAngles.length > 5) {
    	lastfiveAngles.shift();
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

		if (
			!modeAbsAccel && Math.abs(lastfiveAccels[lastfiveAccels.length-1] - lastfiveAccels[lastfiveAccels.length-2]) > min_accel_front ||
			modeAbsAccel && lastfiveAccels[lastfiveAccels.length-1] < min_abs_accel_front){ 
			
			if (!modeAbsAngle && lastfiveAngles[lastfiveAngles.length-1] - lastfiveAngles[lastfiveAngles.length-2] > min_angle_front || 
			modeAbsAngle && absAngle > min_abs_angle_front){
				
				if (!modeOneWay || (modeOneWay && last_hit == 'BACK')){
					frontSfx.play();
					
					last_hit = 'FRONT';
					flash(FRONT_COLOR);	
				}	
			}
		}
		
		else if(
			!modeAbsAccel && Math.abs(lastfiveAccels[lastfiveAccels.length-1] - lastfiveAccels[lastfiveAccels.length-2]) > min_accel_back ||
			modeAbsAccel && lastfiveAccels[lastfiveAccels.length-1] > min_abs_accel_back){
				
			if (!modeAbsAngle && lastfiveAngles[lastfiveAngles.length-1] - lastfiveAngles[lastfiveAngles.length-2] < -min_angle_back ||
			modeAbsAngle &&  absAngle < min_abs_angle_back){
			
				if (!modeOneWay || (modeOneWay && last_hit == 'FRONT')){
					backSfx.play();
					
					last_hit = 'BACK';
					flash(BACK_COLOR);
				}
			}
		}
	
	}
	
	debugTxtAccel.text = 'Accel: ' + aveAccel;
	
	lastfiveAccels.push(aveAccel);
	if (lastfiveAccels.length > 5) {
    	lastfiveAccels.shift();
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
	
	debugTxtLastfiveAccels.text = 'Accels: ' + lastfiveAccels.join(', ');
	debugTxtLastfiveAngles.text = 'Angles: ' + lastfiveAngles.join(', ');

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
	}, 80);
}

function roundIt(_num){
	return Math.round(_num * 1000) / 1000;
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(20, false);} catch(e){} // max media volume
}