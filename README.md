# SMMO World Boss Notifier
This is a Discord bot using Discord.js that posts reminders about SMMO world bosses to a channel.

This bot is _very_ basic and, so far, not thoroughly tested. Contributions are welcome.

## Set Up
You will need to provide your own config.json. This config should contain two keys: BOT_TOKEN (your Discord bot's API key) and SMMO_TOKEN (your SMMO API key obtained from https://web.simple-mmo.com/p-api/home).

The bot will automatically get a list of upcoming world bosses on launch and is hardcoded to send reminders about those bosses to a channel called "smmo-wb-reminders".
