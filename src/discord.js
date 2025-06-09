const Discord = require('discord.js');
const auth = require('./auth.json');

const CHANNEL_ID = '385206081594327042';
const client = new Discord.Client();
let chaos = false;

// bot is ready
client.on('ready', (event) => {
    console.log('Connected!');
});

client.on('error', (error) => {
    console.log(error);
});

client.on('disconnect', (event) => {
    console.log(event);
});

client.on('message', (message) => {
    parseMessage(message);
});

const sendMessage = (message) => {
    let channel = client.channels.find(c => c.id === CHANNEL_ID);
    channel.send(message);
};

const sendTTSMessage = (message) => {
    let channel = client.channels.find(c => c.id === CHANNEL_ID);
    channel.send(message, { tts: true });
};

const parseMessage = (message) => {
    if (message.content === '!chaos') {
        let msg = "chaos mode is ";
        msg += chaos === true 
            ? "on"
            : "off";
        sendTTSMessage(msg);
        return;
    } else if (message.content === '!chaos on') {
        if (chaos === true) {
            sendTTSMessage('Chaos mode is already on, stupid');
        } else {
            chaos = true;
            sendTTSMessage('Chaos mode is ON');
        }
        return;
    } else if (message.content === '!chaos off') {
        if (chaos === false) {
            sendTTSMessage('Chaos mode is already off, stupid');
        } else {
            chaos = false;
            sendTTSMessage('Chaos mode is OFF');
        }
        return;
    }

    if (!message.tts && chaos) {
        sendTTSMessage(message.content);
    }
};

client.login(auth.token);