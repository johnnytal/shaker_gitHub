var shakerMain = function(game){
	FRONT_COLOR = '#c1ad65';
	BACK_COLOR = '#656d7c';	
	DEFAULT_COLOR = '#002255';

	resetTouching = true;

	aveAccel = 0;
	accelX = 0;
	accelY = 0;
	accelZ = 0;
	
	min_accel = 2.5;
	
	lastTenAccels = [];
	lastTenAngles = [];

	angle = 0;
	min_angle = 4;
	
	last_hit = '';
};

shakerMain.prototype = {
    create: function(){
		initVars();
 
		XtraUIbuttons();
		
	    debugTxtAngle = game.add.text(20, 15, "Angle" , {font: '21px', fill: 'lightgreen'});
	    //debugTxtAccel = game.add.text(20, 45, "Accel" , {font: '21px', fill: 'lightgreen'});
	    
	    debugTxtHitAngle = game.add.text(20, 85, "Angle at hit" , {font: '21px', fill: 'white'});
	    debugTxtHitAccel = game.add.text(20, 115, "Accel at hit" , {font: '21px', fill: 'white'});
	    
	    debugTxtLastHit = game.add.text(20, 200, "last hit" , {font: '22px', fill: 'lightgrey'});
	    
	    debugTxtLastTenAccels = game.add.text(10, 330, "Accels: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]" , 
	    {font: '21px', fill: 'white'});
	    debugTxtLastTenAngles = game.add.text(10, 360, "Angles: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]" , 
	    {font: '21px', fill: 'white'});

		try{window.addEventListener('deviceorientation', readAngle);} catch(e){}
		try{window.addEventListener('devicemotion', readAcc);} catch(e){}

		initPlugIns();
    }
};

function readAngle(event){	
	angle = roundIt(event.gamma);

	debugTxtAngle.text = 'Angle: ' + angle;
	
	lastTenAngles.push(angle);
	if (lastTenAngles.length > 6) {
    	lastTenAngles.shift();
	}
	
}

function readAcc(event){
	accelX = roundIt(event.acceleration.x);
	accelY = roundIt(event.acceleration.y);
	accelZ = roundIt(event.acceleration.z);
	
	aveAccel = roundIt((accelX + accelY + accelZ) / 3);
	
	lastTenAccels.push(aveAccel);
	if (lastTenAccels.length > 6) {
    	lastTenAccels.shift();
	}

	/*debugTxtAccel.text = 'Accel: ' + roundIt(aveAccel) +
	'  (X: ' + roundIt(accelX) + ',  Y: ' + roundIt(accelY) + ',  Z: ' + roundIt(accelZ) + ')';*/

	if (!frontSfx.isPlaying && !backSfx.isPlaying){
		if (Math.abs(lastTenAccels[lastTenAccels.length-1] - lastTenAccels[lastTenAccels.length-2]) > min_accel){ 
			if (lastTenAngles[lastTenAngles.length-1] - lastTenAngles[lastTenAngles.length-2] > min_angle){ 
				frontSfx.play();
				
				last_hit = 'FRONT';
				flash(FRONT_COLOR);	
			}
			else if (lastTenAngles[lastTenAngles.length-1] - lastTenAngles[lastTenAngles.length-2] < -(min_angle / 4)){
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
	
	debugTxtLastTenAngles.text = 'Angles: ' + lastTenAngles;
	debugTxtLastTenAccels.text = 'Accels: ' + lastTenAccels;

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
    plus = game.add.sprite(620, 230, 'plus');
    plus.scale.set(.85, .85);
    plus.alpha = 0.85;
    plus.inputEnabled = true;
    plus.events.onInputDown.add(function(){
    	min_accel += 0.05;
    	backText.text = "accel: " + roundIt(min_accel);
    	plus.tint = 0xf04030;
    	setTimeout(function(){plus.tint = 0xffffff;}, 100);
    }, this);
    
    minus = game.add.sprite(525, 230, 'minus');
    minus.scale.set(.85, .85);
    minus.alpha = 0.85;
    minus.inputEnabled = true;
    minus.events.onInputDown.add(function(){
    	min_accel -= 0.05;
    	backText.text = "accel: " + roundIt(min_accel);
    	minus.tint = 0xf04030;
    	setTimeout(function(){minus.tint = 0xffffff;}, 100);
    }, this);
        
    backText = game.add.text(540, 180, "accel: " + roundIt(min_accel),
    {font: '24px', fill: 'white'});

    plusD = game.add.sprite(620, 60, 'plus');
    plusD.scale.set(.85, .85);
    plusD.inputEnabled = true;
    plusD.events.onInputDown.add(function(){
    	min_angle += 0.05;
    	frontText.text = "angle: " + roundIt(min_angle);
    	plusD.tint = 0xf04030;
    	setTimeout(function(){plusD.tint = 0xffffff;}, 100);
    }, this);
    
    minusD = game.add.sprite(525, 60, 'minus');
    minusD.scale.set(.85, .85);
    minusD.inputEnabled = true;
    minusD.events.onInputDown.add(function(){
    	min_angle -= 0.05;
    	frontText.text = "angle: " + roundIt(min_angle);
    	minusD.tint = 0xf04030;
    	setTimeout(function(){minusD.tint = 0xffffff;}, 100);
    }, this);
	
    frontText = game.add.text(545, 10, "angle: " + roundIt(min_angle),
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