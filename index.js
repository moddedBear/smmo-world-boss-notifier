const Discord = require("discord.js");
const schedule = require('node-schedule');
const axios = require('axios');
const parse = require('parse-duration');

const config = require("./config.json");

const client = new Discord.Client();

let bosses = [];
// This commented out declaration of bosses can be used for testing purposes
// let bosses = [
//   {
//     id: 262,
//     name: 'Monster 1',
//     avatar: 'bosses/15',
//     level: 638,
//     god: 0,
//     str: 547,
//     def: 840,
//     dex: 346,
//     current_hp: 11002063,
//     max_hp: 11002063,
//     enable_time: 1613253849+90
//   },
//   {
//     id: 262,
//     name: 'Monster 2',
//     avatar: 'bosses/15',
//     level: 638,
//     god: 0,
//     str: 547,
//     def: 840,
//     dex: 346,
//     current_hp: 11002063,
//     max_hp: 11002063,
//     enable_time: 1613253849+110
//   }
// ];

schedule.scheduleJob("10 12 * * 1", function(){
  getBossList();
})

client.login(config.BOT_TOKEN);

client.on("ready", () => {
  console.log("Connected to Discord");
  getBossList();
})

function getBossList() {
  axios.post("https://api.simple-mmo.com/v1/worldboss/all?api_key=" + config.SMMO_TOKEN, {
    api_key: config.SMMO_TOKEN,
  }).then((res) => {
    bosses = res.data;
    console.log(bosses);
    scheduleBosses();
  }).catch((error) => {
    console.error(error);
  })
}

function scheduleBosses() {
  let indexCounter = 0;
  for (boss of bosses) {
    for (remindTime of config.REMINDERS) {
      let reminder = new Date((boss.enable_time * 1000) - parse(remindTime));
      schedule.scheduleJob(reminder, function(x, y){
        sendReminder(x, y);
      }.bind(null, boss, remindTime));
      console.log(`Reminder scheduled for Level ${boss.level} ${boss.name} at ${reminder.toDateString()} ${reminder.toTimeString()}`);
    }
    indexCounter++;
  }
}

function sendReminder(boss, remindTime) {
  let isEarly = parse(remindTime) > 0;
  console.log(`Sending ${isEarly ? "early " : ""}reminder for Level ${boss.level} ${boss.name}`);
  let channel = client.channels.cache.find(channel => channel.name === config.CHANNEL_NAME);
  channel.send(`Level ${boss.level} ${boss.name} ${isEarly ? "will be" : "is"} attackable ${isEarly ? `in ${remindTime}` : "now"}!`);
}