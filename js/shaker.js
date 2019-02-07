var shakerMain = function(game){
	LOUD_VOL = 1.3;
	MIN_VOL = 0.158;
	
	LOUD_COLOR = '#f1ead7';
	GENTLE_COLOR = '#c1ad65';
	BACK_COLOR = '#656d7c';

	gamma = 0;
	accelX = 0;
	volume = 0;
	
	accelFactor = 57;
	gammaFactor = 730;
	ballFactor = 969;

	resetTouching = true;
};

shakerMain.prototype = {
    create: function(){
        circles = game.add.group();
		circles.enableBody = true;
		circles.physicsBodyType = Phaser.Physics.ARCADE;
		
		circle = circles.create(0, 0, 'circle');
        circle.x = WIDTH / 2 - circle.width / 2;
        circle.y = HEIGHT / 2 - circle.height / 2;
        circle.scale.set(ballFactor/1000, ballFactor/1000);
 
        circle.body.collideWorldBounds = true;
        
        angleText = game.add.text(510, 20, "Shake It!", {font: '26px', fill: 'white'});
        
        accelText = game.add.text(10, 10, "accel", {font: '26px', fill: 'white'});
        gammaText = game.add.text(10, 50, "gamma", {font: '26px', fill: 'white'});
        ballText = game.add.text(10, 90, "ball", {font: '26px', fill: 'white'});
        loudText = game.add.text(10, 130, "vol", {font: '26px', fill: 'white'});
		
		loadSounds();
		initPlugIns();
		createUI();
    },
    
    update: function(){
    	if (circle.y > 22 && circle.y < HEIGHT - circle.height - 22){
    		resetTouching = true;
    	}
    	
    	if (volume > MIN_VOL && resetTouching){	    	
	    	if (circle.y == 0){ // front
	    		
    			if (volume < LOUD_VOL){
    				shakerGentle.volume = volume + 0.2;
    				shakerGentle.play();

					flash(GENTLE_COLOR);	
    			}
    			else {
    				shakerStrong.volume = volume - (LOUD_VOL / 5);
    				shakerStrong.play();

					flash(LOUD_COLOR);
    			}
    		}
	    	
	    	else if (circle.y == HEIGHT - circle.height){ // back    		
    			shakerBack.volume = volume + 0.2;
    			shakerBack.play();

				flash(BACK_COLOR);
			}	
    	}
	}
};

function deviceMotion(event){
	accelX = roundIt(event.acceleration.x);
	
	circle.body.velocity.y = accelX * accelFactor;
	volume = roundIt(Math.abs(accelX / 12));
}

function handleOrientation(event){
	gamma = roundIt(event.gamma);  // -90,90 X
	
	circle.body.gravity.y = (gamma * gammaFactor) * -1;
}

function flash(_color){
	resetTouching = false;
	
	angleText.text = 'gamma: ' + gamma + '\naccel: ' + accelX;

	game.stage.backgroundColor = _color;
	
	if (_color == LOUD_COLOR){
		window.plugins.flashlight.switchOn();
	}

	setTimeout(function(){
		if (window.plugins.flashlight.isSwitchedOn()){
			window.plugins.flashlight.switchOff();
		}
		game.stage.backgroundColor = '#000000';
	}, 215);
}

function createUI(){
	var sliderAccel = document.getElementById("accel");
	
	accelText.text = 'Accel: ' + sliderAccel.value;

	sliderAccel.oninput = function() {
		accelText.text = 'Accel: ' + this.value;
		accelFactor = this.value;
	};
	
	var sliderGamma = document.getElementById("gamma");
	
	gammaText.text = 'Gamma: ' + sliderGamma.value;

	sliderGamma.oninput = function() {
		gammaText.text = 'Gamma: ' + this.value;
		gammaFactor = this.value;
	};
	
	var sliderBall = document.getElementById("ball");
	
	ballText.text = 'Ball: ' + sliderBall.value / 1000;

	sliderBall.oninput = function() {
		ballText.text = 'Ball: ' + this.value / 1000;
		ballFactor = this.value / 1000;
		
		circle.scale.set(ballFactor, ballFactor);
	};
	
	var sliderLoud = document.getElementById("loud");
	
	loudText.text = 'Vol: ' + sliderLoud.value / 1000;

	sliderLoud.oninput = function() {
		loudText.text = 'Vol: ' + this.value / 1000;
		MIN_VOL = this.value / 1000;
		LOUD_VOL = 1.3 + (MIN_VOL - 0.25);
	};
	
}

function roundIt(_num){
	return Math.round(_num * 100) / 100;
}

function initPlugIns(){
	if (window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', handleOrientation);
	}
	else{
		angleText.text = 'orientation not supported';
	}
	
	if (window.DeviceMotionEvent) {
	  	window.addEventListener('devicemotion', deviceMotion);
	}
	else{
		angleText.text = 'motion not supported';
	}

    try{window.plugins.insomnia.keepAwake();} catch(e){} // keep awake
    try{StatusBar.hide();} catch(e){} // hide status bar
    try{window.androidVolume.setMusic(100, false);} catch(e){} // max media volume
}

function loadSounds(){
	shakerGentle = game.add.audio('shakerGentle', 1, false);
	shakerStrong = game.add.audio('shakerStrong', 1, false);
	shakerBack = game.add.audio('shakerBack', 1, false);
}