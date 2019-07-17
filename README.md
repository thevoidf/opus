# opus

#### Development
create .env

```js
TOKEN=<BOT_TOKEN>
PREFIX=<PREFIX_FOR_BOT>
LOG_CHANNEL=<CHANNEL_ID_FOR_LOGS>
```
start it
```bash
npm install
npm start # start the bot
npm run watch # watch file changes
```

##### Features for now
* Player
* Basic moderation (kick, ban, mute)
* Calculator

##### Examples
```js
$kick @user1 @user2 they were annoying
$play <YOUTUBE_URL>
$calc pow(2, 4) / (cos(1.5) * 10)
```
