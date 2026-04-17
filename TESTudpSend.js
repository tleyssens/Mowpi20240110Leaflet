var dgram = require('dgram');

var client = dgram.createSocket('udp4');
let i=0
for(i=0;i<1000;i+0.1) {
    let msg = 'MyValue:' + i++;
    console.log(msg)
    client.send(msg ,0, msg.length, 47269, '127.0.0.1');
}

client.send('Hello World!',0, 12, 47269, '127.0.0.1');
client.send('Hello2World!',0, 12, 47269, '127.0.0.1');
client.send('Hello3World!',0, 12, 47269, '127.0.0.1', function(err, bytes) {
client.close();
});