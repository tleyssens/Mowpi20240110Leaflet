'use strict';
let TomMotorDebug = require('debug')('tom:TomMotor')
//let term = require( 'terminal-kit' ).terminal ;

var TomMotor = (function() {
	var Gpio = require('pigpio').Gpio,
		startSpeed = 0,
		tartgetSpeed = 0,
		angle = 0,
		value = 0,
		speed = 0,
		t1 =0,
		ramping = false,
		n = 0,
		minSpeed = 70;

	function Setup(enable, cw, ccw, minSpeed, maxSpeed) {		
		TomMotorDebug('In MotorSetup enable:%s; cw:%s, ccw:%s, minSpeed:%s, maxSpeed:%s', enable, cw, ccw, minSpeed, maxSpeed);
		this.enable = enable;
		this.speed = 0;
		this.minSpeed = minSpeed;
		this.maxSpeed = maxSpeed;
		this.Forward = true;
		this.ramping = false;
		this.t1 = 0;
		this.motEnable 	= new Gpio(enable,{mode: Gpio.OUTPUT});
		this.motCw 		= new Gpio(cw,{mode: Gpio.OUTPUT});
		this.motCw.digitalWrite(0);
		this.motCcw		= new Gpio(ccw,{mode: Gpio.OUTPUT});
		this.motCcw.digitalWrite(1);
		this.hitTargetSpeed = false;
	}
	
	Setup.prototype = {
		constructor : 		Setup,//Enable,
		ramp:				ramp,
		update:				update,
		onTargetSpeed: 		onTargetSpeed,
		isOn: 				isOn,
		rampDown: 			rampDown,
		rampUp: 			rampUp,
		toggleDirection: 	toggleDirection,
		stop: 				stop,
		drive: 				drive,
		cleanup: 			cleanup 
	}    

	function ramp(value, angle) {
		//this.value = value;
		this.angle = angle;
		//stopEverything();
		this.startSpeed = getSpeed(this);
		//this.value = value;
		this.targetSpeed = value;
		this.accAngle = angle; 
		this.rampDir = 1;
		//TomMotorDebug('in TomMotor.Ramp '+ ' ' + this.targetSpeed + ' ' + this.accAngle);
		//TomMotorDebug('this in ramp= ' + JSON.stringify(this));
		if(speedShouldChange(this)) {
				TomMotorDebug('speedShouldChange');
				this.t1 = 20;
				startRamping(this);
		}
		else {
				stopRamping(this);
		}
	}

	function update () {	
		//that = this
		//intervalID = setInterval (function(){
			//TomMotorDebug('this in update= ' + JSON.stringify(this));
			clearInterval(this.interval);
			if(this.ramping) {
			//TomMotorDebug('this in update1= ' + JSON.stringify(that));
			ramp2(this);
			}
		//},20);
	}

	function ramp2 (mot) {
		mot.interval = setInterval (function() {
			if(mot.speed != mot.targetSpeed) {
				process.stdout.write('\r   in ramp2() startspeed=' + mot.startSpeed + ' ; angle = ' + mot.accAngle + ' ; time = ' + mot.t1);
				//TomMotorDebug('speedber = ' +
				/*origineel:
				setSpeed( mot, mot.startSpeed + mot.rampDir*(1/mot.accAngle)*mot.t1);
				TomMotorDebug('                    mot = ' + JSON.stringify(mot));
				mot.t1 = mot.t1+20;
				*/
				setSpeed( mot, mot.startSpeed + mot.rampDir* (1/mot.accAngle) * mot.t1 );
				mot.t1 = mot.t1 + 20;
			}
			else {
				TomMotorDebug('   in ramp2() else');
				stopRamping(mot);
			}
		},20);
	}

	function onTargetSpeed () {
		//TomMotorDebug('in onTargetSpeed');
		if (!this.ramping) {
			if (!this.hitTargetSpeed) {
				TomMotorDebug('hittargetSpeed = true')
				return this.hitTargetSpeed = true;
			}
			else return false;
		}
		else 
		{
				//TomMotorDebug('hitTargetSpeed = false')
				return this.hitTargetSpeed = false;
		}
	}
	function rampDown (angle) {
		//TomMotorDebug	('In rampDown ' + angle);
		this.angle = angle;
		//TomMotorDebug	('In rampDown ' + this.angle);
		this.ramp(0, this.angle);
	}

	function rampUp (angle) {
		this.angle = angle;
		this.ramp(255, this.angle);
	}

	
	function setSpeed (mot, value) {
		//TomMotorDebug('\r            mot in setspeed = ' + JSON.stringify(mot) +'\r');
		//process.stdout.write("\r                       mot in setspeed = " + JSON.stringify(mot) + " ");
		//TomMotorDebug('in setSpeed: value = ' + value + ' targetspeed = ' + mot.targetSpeed);
		if (mot.startSpeed < minSpeed) { 
			mot.startSpeed = minSpeed;
		}; 
		if (value > -1 && value < 256) {
			if (mot.speed != value) {
				mot.speed = value.toFixed(0);
				TomMotorDebug('    speed in setSpeed = ' + mot.speed);
				mot.motEnable.pwmWrite(mot.speed);
				return mot.speed;
			}
		}
		else {
			mot.speed = mot.targetSpeed;
			//TomMotorDebug('speed in setSpeed Else = ' + mot.speed);
			mot.motEnable.pwmWrite(mot.speed);
			return mot.speed;
		}
	}

	function drive(v) {
		//TomMotorDebug ('drive='+ v);
		if (Math.sign(v) > 0) {
			this.motCw.digitalWrite(0);
			this.motCcw.digitalWrite(1);
		}
		else {
			this.motCw.digitalWrite(1);
			this.motCcw.digitalWrite(0);
		}
		v = map_range(Math.abs(v), 0 , 255, this.minSpeed, this.maxSpeed).toFixed(0); // geeft altijd minimum 10 terug 
						//0 wordt minspeed dus 10
		// TomMotorDebug("v na map_range = %s" ,v );
		// if (Math.abs(v) < 20) {//this.minSpeed ) { ==> te klein signaal
		// 	v = 0;
		// } else {
		// 	v = map_range(Math.abs(v), 20 , 255, this.minSpeed, this.maxSpeed).toFixed(0)
		// }
		// if (Math.abs(v) > 250) {
		// 	v = this.maxSpeed;
		// }
		// TomMotorDebug('       v' + v);
		// this.motEnable.pwmWrite(Math.abs(v));
		if (Math.abs(v) <= this.minSpeed ) {
			v = 0;
		} 
		if (Math.abs(v) > 250) {
			v = this.maxSpeed;
		}
		//TomMotorDebug('       v' + v);
		this.motEnable.pwmWrite(Math.abs(v));

	}

	function isOn () {
		//TomMotorDebug('In isOn ' + this.speed);
		return getSpeed(this) != 0;
	}
	function getSpeed (mot) {
		//TomMotorDebug	('In getSpeed: '+ mot.speed);
		return mot.speed;
	}

	function speedShouldChange (mot) {
		//TomMotorDebug('In speedChouldChange');
		return speedDifference(mot) !=0;
	}

	function startRamping (mot) {
		TomMotorDebug('Start ramping');
		mot.motCw.digitalWrite(!mot.Forward);
		mot.motCcw.digitalWrite(mot.Forward);
		mot.ramping = true;
		mot.update();
	}

	function speedDifference (mot) {
		//TomMotorDebug('speedDifference = ' + mot.targetSpeed + ' '+ mot.startSpeed +' ' + (mot.targetSpeed - mot.startSpeed));
		mot.rampDir = Math.sign(mot.targetSpeed - mot.startSpeed); 
		return mot.targetSpeed - mot.startSpeed;
	}

	function stopRamping (mot) {
		//TomMotorDebug('Stop ramping');
		mot.ramping = false;
		clearInterval(mot.interval);
	}

	function toggleDirection () {
		TomMotorDebug('Forward = ' + this.Forward);
		this.Forward = !this.Forward;
		this.motCw.digitalWrite(this.Forward);
		this.motCcw.digitalWrite(!this.Forward);
		TomMotorDebug('Forward = ' + this.Forward);
	}

	function stopEverything () {
		TomMotorDebug('In stopEverything');
		ramping = false;
		stop_events = true;
	}

	function isOff() {	
		return getSpeed() == 0;
	}

	function stop() {
		//TomMotorDebug('stop');
		this.ramp(0,1);
	}

	function cleanup() {
		this.motEnable.digitalWrite(0);
	}
	
	function map_range(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);//5 , 255, this.minSpeed, this.maxSpeed
		//      10 +   ( 255 -  10)  * (  5   - 5   ) / (   255 - 5 ) = 10
		//      10 +   ( 255 -  10)  * (  0   - 5   ) / (   255 - 5 ) = 5,1
}

	return {
		Setup:			Setup
	}
}());
module.exports = TomMotor;