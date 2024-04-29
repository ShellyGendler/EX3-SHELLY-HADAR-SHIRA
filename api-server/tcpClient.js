
const net = require('net');
const HOST = '127.0.0.1';
const PORT = 8080;

let client = new net.Socket();
let isClientConnected = false;

// Function to create a connection to the TCP server
function connectToServer() {
    return new Promise((resolve, reject) => {
        if (!isClientConnected) {
            client.connect(PORT, HOST, () => {
                console.log('Connected to server!');
                isClientConnected = true;
                resolve(client);
            });

            client.on('error', (err) => {
                console.error('Connection error:', err);
                isClientConnected = false;
                reject(err);
            });

            client.on('close', () => {
                console.log('Connection closed by the server.');
                isClientConnected = false;
            });
        } else {
            resolve(client);
        }
    });
}

// Function to send data to the server
function sendData(data) {
    return new Promise((resolve, reject) => {
        if (client) {
            client.write(data + '\n', 'utf8', () => {
                console.log('Data sent:', data);
                resolve();
            });
        } else {
            reject(new Error("Client is not connected."));
        }
    });
}

// Function to receive data from the server
function receiveData() {
    return new Promise((resolve, reject) => {
        // Attach the data listener only once to prevent multiple listener addition
        client.once('data', (data) => {
            console.log('Received data:', data.toString());
            resolve(data.toString());
        });

        // Errors are already handled by the listener in connectToServer
    });
}

module.exports = {
    connectToServer,
    sendData,
    receiveData
};