'use strict';
module.exports = function (sim) {
	const {
		exec
	} = require('child_process');
	const net = require('net');
	const client = new net.Socket();
	const split = require('split');

	sim.prototype.streamStart = function (io) {
		console.log('in streamStart');
		function os_func() {
			this.execCommand = function (cmd, callback) {
				exec(cmd, (err, stdout, stderr) => {
					if (err) {
						console.log('error str2str' + err);
						io.emit('log', err);
						return;
					}
					callback(stdout);
				});
			};
		};
		var os = new os_func();
		os.execCommand('pkill -9 str2str', function (returnvalue) {});
		os.execCommand('../rtk/str2str -in ../rtk/LogThuis1.ntrip::T::x1::+330 -out tcpsvr://:52000', function (returnvalue) {});
		client.connect(52000, '127.0.0.1', function () {
			console.log('nmea-client connected');
			io.emit('log', 'Connected to NS-HP-output');
		}); //client krijgt constant data van de str2str naar poort 52000
		var stream = client.pipe(split('\r\n'));
		return stream ;
	};
};