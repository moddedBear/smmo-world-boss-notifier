# SMMO World Boss Notifier
This is a Discord bot using Discord.js that posts reminders for SMMO world bosses to a channel.

This bot is pretty basic and can only be configured through a config.json file.

## Configuration
You will need to provide your own config.json. This file should contain:
* BOT_TOKEN: the API key for the Discord bot
* SMMO_TOKEN: your SMMO API key obtained from https://web.simple-mmo.com/p-api/home
* CHANNEL_NAME: the name of the Discord text channel to send reminders to
* REMINDERS: an array of times before each world boss that a reminder will be sent

### Example config.json
```
{
  "BOT_TOKEN": "discord-key",
  "SMMO_TOKEN": "smmo-key",
  "CHANNEL_NAME": "smmo-wb-reminders",
  "REMINDERS": ["1 hour", "5 minutes", "0s"]
}
```