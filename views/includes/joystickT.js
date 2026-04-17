var joystick	= new VirtualJoystick({
	container	: document.getElementById('containerJoystick'),
	mouseSupport	: true,
	limitStickTravel: true,
	stickRadius		: 125,
	stationaryBase : true,
	baseX: 0,
	baseY: 0
});

console.log("touchscreen is", VirtualJoystick.touchScreenAvailable() ? "available" : "not available");
console.log('joystick ' + JSON.stringify(joystick, null, 4));
console.log(joystick._container);
var down = 0;
joystick.addEventListener('touchStart', function(){
    console.log('touchdown')
    down = 1;
})
joystick._container.addEventListener('mousedown', function(){
    console.log('mousedown')
    down = 1;
})
joystick.addEventListener('touchEnd', function(){
    console.log('touchup')
    down = 0;
})
joystick._container.addEventListener('mouseup', function(){
    console.log('mouseup')
    down = 0;
})
//cc:touchbesturing#2;Stuur coördinaten touch via socket key naar server
setInterval(function(){
    if (down) {
        //console.log('test');
        var outputEl	= document.getElementById('joystickResult');
        outputEl.innerHTML	= '<b>Result:</b> '
            + ' dx:'+  joystick.deltaX().toFixed(1)
            + ' dy:'+ -joystick.deltaY().toFixed(1)
            + (joystick.right()	? ' right'	: '')
            + (joystick.up()	? ' up'		: '')
            + (joystick.left()	? ' left'	: '')
            + (joystick.down()	? ' down' 	: '')	
        socket.emit('key', { Key: 'Steering', speed: -joystick.deltaY().toFixed(1)*2, steer: joystick.deltaX().toFixed(1)*2});
        //socket.emit('key', { Key: 'Steering', value: joystick.deltaX().toFixed(1)});
//console.log('result ' + JSON.stringify(outputEl, null, 4));
    }
}, 1/8 * 1000);