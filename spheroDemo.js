var mqtt = require('./mqtt-wrapper.js')();
var sphero = require("sphero"),
    //bb8 = sphero("591d2f622f7848a68a008d0dafa67c81"); // change BLE address accordingly
    bb8 = sphero("af5b2706645e4502884347d2558ad333");
bb8.connect(function() {

  console.log("**** Start debug info *****");
  console.log("Connected to BB-8");


  bb8.ping(function(err, data) {
    console.log("Output of ping command");
    console.log(err || data);
    console.log("End of ping data");
  });
  console.log("BB-8 is changing color to green to indicate that it is connected")
  bb8.color("green");
  console.log("**** End debug info *****");


  mqtt.connect(function(client, deviceId) {
		client.on('connect', function() {
			console.log('MQTT client connected to IBM IoT Cloud.');
			console.log('Connected Sphero ID: ' + deviceId);
			client.subscribe('iot-2/cmd/run/fmt/json', {
				qos : 0
			}, function(err, granted) {
				if (err) {
					throw err;
				}
				console.log("subscribed to iot-2/cmd/run/fmt/json");
			});
		});

		client.on('message', function(topic, message, packet) {
			console.log(topic);
			var msg = JSON.parse(message.toString());
			console.log(msg);
			if (msg.d.action === '#spheroturn') {
				console.log('Change color to RED and turn & move');
       			bb8.color("red");
       			//setTimeout(function(){
       			bb8.setHeading(90);
       			//},2000);

			}

			else if (msg.d.action === '#spherostop') {
        		console.log('Change color to BLUE and stop');
        		bb8.color("blue");
        		bb8.stop();


			}

			else if (msg.d.action === '#spherorun') {
				console.log('Get Sphero to run');
			        bb8.roll(150, 0);
			        setTimeout(function(){
			          bb8.stop();
			        }, 3000); //Stop after 3 seconds

			        bb8.color("green");

			}

			else if (msg.d.action === '#spherorunback') {
				console.log('Get Sphero to run');
       			bb8.roll(150, 180);
        		setTimeout(function(){
          			bb8.stop();
        		}, 3000); //Stop after 3 seconds
        		bb8.color("green");

			}


		});
	});

});
