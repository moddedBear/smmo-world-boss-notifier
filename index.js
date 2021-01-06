const Discord = require("discord.js");
const schedule = require('node-schedule');
const axios = require('axios');
const fs = require('fs');

// The config needs two keys: BOT_TOKEN and SMMO_TOKEN
const config = require("./config.json");

const client = new Discord.Client();
const prefix = "!";
const remindTime = 300; // The number of seconds before each boss that the initial early reminder should be sent

let bosses = [];
// let bosses = [
//   {
//     id: 262,
//     name: 'Slagcreep',
//     avatar: 'bosses/15',
//     level: 638,
//     god: 0,
//     str: 547,
//     def: 840,
//     dex: 346,
//     current_hp: 11002063,
//     max_hp: 11002063,
//     enable_time: 1609911480+remindTime+30
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
//     enable_time: 1609911480+remindTime+50
//   }
// ];

schedule.scheduleJob("0 4 * * 1", function(){
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
    let earlyReminder = new Date((boss.enable_time - remindTime) * 1000);
    console.log(`Reminder scheduled for ${earlyReminder.toTimeString()}`);
    let reminder = new Date(boss.enable_time * 1000);

    schedule.scheduleJob(earlyReminder, function(x){
      sendReminder(x, true);
    }.bind(null, boss));
    schedule.scheduleJob(reminder, function(x){
      sendReminder(x, false);
    }.bind(null, boss));

    indexCounter++;
  }
}

function sendReminder(boss, isEarly) {
  console.log("Sending reminder");
  let channel = client.channels.cache.find(channel => channel.name === "smmo-wb-reminders");
  if (isEarly) {
    channel.send(`Level ${boss.level} ${boss.name} is attackable in 5 minutes!`);
  }
  else {
    channel.send(`Level ${boss.level} ${boss.name} is attackable now!`);
  }
}