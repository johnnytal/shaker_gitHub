var shakerMain = function(game){
	FRONT_COLOR = '#c1ad65';
	BACK_COLOR = '#656d7c';	
	DEFAULT_COLOR = '#002255';

	aveAccel = 0;
	accelX = 0;
	accelY = 0;
	accelZ = 0;
	
	min_accel = 1.8;
	
	lastTenAccels = [];
	lastTenAngles = [];

	angle = 0;
	min_angle = 3.6;
	
	last_hit = '';
};

shakerMain.prototype = {
    create: function(){
		game.stage.backgroundColor = DEFAULT_COLOR;

		backSfx = game.add.audio('back');
		frontSfx = game.add.audio('front');

	    debugTxtAngle = game.add.text(20, 15, "Angle" , {font: '22px', fill: 'lightgreen'});
 
	    debugTxtHitAngle = game.add.text(20, 85, "Angle at hit" , {font: '22px', fill: 'white'});
	    debugTxtHitAccel = game.add.text(20, 115, "Accel at hit" , {font: '22px', fill: 'white'});
	    
	    debugTxtLastHit = game.add.text(20, 200, "last hit" , {font: '22px', fill: 'lightgrey'});
	    
	    debugTxtLastTenAccels = game.add.text(10, 330, "Accels:" ,{font: '22px', fill: 'white'});
	    debugTxtLastTenAngles = game.add.text(10, 360, "Angles:" ,{font: '22px', fill: 'white'});

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
	accelX = roundIt(event.acceleration.x);
	accelY = roundIt(event.acceleration.y);
	accelZ = roundIt(event.acceleration.z);
	
	aveAccel = roundIt((accelX + accelY + accelZ) / 3);
	
	lastTenAccels.push(aveAccel);
	if (lastTenAccels.length > 8) {
    	lastTenAccels.shift();
	}

	if (!frontSfx.isPlaying && !backSfx.isPlaying){
		if (Math.abs(lastTenAccels[lastTenAccels.length-1] - lastTenAccels[lastTenAccels.length-2]) > min_accel){ 
			if (lastTenAngles[lastTenAngles.length-1] - lastTenAngles[lastTenAngles.length-2] > min_angle){ 
				frontSfx.play();
				
				last_hit = 'FRONT';
				flash(FRONT_COLOR);	
			}
			else if (lastTenAngles[lastTenAngles.length-1] - lastTenAngles[lastTenAngles.length-2] < -(min_angle / 8)){
				backSfx.play();
				
				last_hit = 'BACK';
				flash(BACK_COLOR);
			}
		}
	}	
}

function flash(_color){
	debugTxtHitAngle.text = 'Angle at hit: ' + angle;
	debugTxtHitAccel.text = 'Accel at hit: ' + aveAccel + '\n(X: ' + accelX + ',  Y: ' + accelY + ',  Z: ' + accelZ + ')';;
	
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
    plus = game.add.sprite(620, 250, 'plus');
    plus.alpha = 0.85;
    plus.inputEnabled = true;
    plus.events.onInputDown.add(function(){
    	min_accel += 0.05;
    	backText.text = "accel: " + roundIt(min_accel);
    	plus.tint = 0xf04030;
    	setTimeout(function(){plus.tint = 0xffffff;}, 100);
    }, this);
    
    minus = game.add.sprite(525, 250, 'minus');
    minus.alpha = 0.85;
    minus.inputEnabled = true;
    minus.events.onInputDown.add(function(){
    	min_accel -= 0.05;
    	backText.text = "accel: " + roundIt(min_accel);
    	minus.tint = 0xf04030;
    	setTimeout(function(){minus.tint = 0xffffff;}, 100);
    }, this);
        
    backText = game.add.text(540, 200, "accel: " + roundIt(min_accel),
    {font: '24px', fill: 'white'});

    plusD = game.add.sprite(620, 80, 'plus');
    plusD.inputEnabled = true;
    plusD.events.onInputDown.add(function(){
    	min_angle += 0.05;
    	frontText.text = "angle: " + roundIt(min_angle);
    	plusD.tint = 0xf04030;
    	setTimeout(function(){plusD.tint = 0xffffff;}, 100);
    }, this);
    
    minusD = game.add.sprite(525, 80, 'minus');
    minusD.inputEnabled = true;
    minusD.events.onInputDown.add(function(){
    	min_angle -= 0.05;
    	frontText.text = "angle: " + roundIt(min_angle);
    	minusD.tint = 0xf04030;
    	setTimeout(function(){minusD.tint = 0xffffff;}, 100);
    }, this);
	
    frontText = game.add.text(545, 30, "angle: " + roundIt(min_angle),
    {font: '24px', fill: 'white'});
}

function roundIt(_num){
	return Math.round(_num * 100) / 100;
}

function initPlugIns(){
    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(10, false);} catch(e){} // max media volume
}