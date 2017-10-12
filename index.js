var noble = require('noble');
const WebSocket = require('ws');
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer();

// Use a dictionary for the peripherals. Key is the mac address and value is the noble peripheral object
let devices = {};

app.use(express.static(path.join(__dirname, '/public')));

const wss = new WebSocket.Server({server: server});
wss.on('connection', function (ws) {

    initBluetooth(ws);

    ws.on('close', function () {
        console.log('stopping client interval');
    });
});

server.on('request', app);
server.listen(8080, function () {
    console.log('Listening on http://localhost:8080');
});

function initBluetooth(ws) {

    noble.startScanning(["180d"]);

    noble.on('stateChange', function (state) {
        if (state === 'poweredOn') {
            // Seek for peripherals broadcasting the heart rate service
            // This will pick up a Polar H7 and should pick up other ble heart rate bands
            // Will use whichever the first one discovered is if more than one are in range
            noble.startScanning(["180d"]);
        } else {
            noble.stopScanning();
        }
    });

    noble.on('scanStart', function () {
        console.log('Scanning for peripherals ...');
    });


    noble.on('scanStop', function () {
        console.log('Scan stopped.');

        setTimeout(function () {
            noble.startScanning(["180d"]);
        }, 500);
    });


    noble.on('discover', function (peripheral) {
        console.log('Found peripheral.');

        peripheral.connect(function (err) {
            handleConnect(err, peripheral);
        });
    });


    function handleConnect(err, peripheral) {
        console.log('Connected.');

        let address = peripheral.address.replace(/\:/g, "");
        devices[address] = peripheral;

        var serviceUUID = ["180d"];
        // 2a37 is the characteristic for heart rate measurement
        // https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.heart_rate_measurement.xml
        var characteristicUUID = ["2a37"];

        // use noble's discoverSomeServicesAndCharacteristics
        // scoped to the heart rate service and measurement characteristic
        devices[address].discoverSomeServicesAndCharacteristics(serviceUUID, characteristicUUID, function (error, services, characteristics) {

            if (!devices[characteristics[0]._peripheralId]) {
                console.log('not connected yet');
            } else {
                devices[characteristics[0]._peripheralId].characteristics = characteristics;
                characteristics[0].notify(true, function (error) {
                    characteristics[0].on('data', function (data, isNotification) {
                        // Upon receiving data, output the BPM
                        // The actual BPM data is stored in the 2nd bit in data (at array index 1)
                        // Thanks Steve Daniel: http://www.raywenderlich.com/52080/introduction-core-bluetooth-building-heart-rate-monitor
                        // Measurement docs here: https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.heart_rate_measurement.xml
                        devices[characteristics[0]._peripheralId].heartRate = data[1];

                        const result = Object.keys(devices).map((key) => {
                            return {
                                name: devices[key].advertisement.localName,
                                heartRate: devices[key].heartRate,
                            }
                        })
                        ws.send(JSON.stringify(result), function () { /* ignore errors */
                        });
                    });
                })
            }
        });

        peripheral.once('disconnect', function () {
            handleDisconnect(peripheral);
        });
    }


    function handleDisconnect(peripheral) {
        console.log('Connection lost.');
        let address = peripheral.address.replace(/\:/g, "");
        if (devices[address].characteristics) {
            devices[address].characteristics[0].unsubscribe(function () {
                console.log('unsubscribed');
            });
        }
        noble.stopScanning();
    }
}