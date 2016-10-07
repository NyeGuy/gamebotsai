var Botkit = require('botkit')
var token = process.env.SLACK_TOKEN

var controller = Botkit.slackbot({
  // reconnect to Slack RTM when connection goes bad
  retry: Infinity,
  debug: false
})

// Assume single team mode if we have a SLACK_TOKEN
if (token) {
  console.log('Starting in single-team mode')
  controller.spawn({
    token: token,
    retry: Infinity
  }).startRTM(function (err, bot, payload) {
    if (err) {
      throw new Error(err)
    }

    console.log('Connected to Slack RTM')
  })
// Otherwise assume multi-team mode - setup beep boop resourcer connection
} else {
  console.log('I\'ve been connected for multi-team mode.')
  require('beepboop-botkit').start(controller, { debug: true })
}

controller.on('bot_channel_join', function (bot, message) {
  bot.reply(message, "I've been added to your Channel. Type 'start' to begin.")
})

//
controller.hears(['hello', 'hi', 'begin', 'start', 'do'], ['direct_message'], function (bot, message) {
  bot.reply(message, 'Greetings <@' + message.user + '>')
  bot.reply(message, 'Welcome to Gamebots.ai. You can type:')
  bot.reply(message, 'profile: to see your gamebot stats')
  bot.reply(message, 'leaderboard: to see active gamebot rankings')
  bot.reply(message, 'help: to list gamebot commands')
})

controller.hears('.*', ['mention'], function (bot, message) {
  bot.reply(message, 'You really do care about me. :heart:')
})

controller.hears('help', ['direct_message', 'direct_mention'], function (bot, message) {
  var help = 'These are the gamebot commands: \n' +
      '`/bomb` Sets an Electo bomb with a three minute delay.\n' +
      '`/laser` Charges a proton laser with a one minute delay.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n' +
      '`/sheild` to raise a plasma shield for five minutes.\n' +
      '`@<your bot\'s name>` to demonstrate detecting a mention.\n'
  bot.reply(message, help)
})

//This launches an attachment. Good for launch of the main screen. 
controller.hears(['start'], ['direct_message', 'direct_mention'], function (bot, message) {
  var text = 'Gamebots.ai is a cloud based game intelligence. Battle your coworkers for control of your slack channel.'
  var attachments = [{
    fallback: text,
    pretext: 'The microgaming system from the future. :sunglasses: :thumbsup:',
    title: 'Battle your coworkers.',
    image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
    title_link: 'https://gamebots.ai/',
    text: text,
    color: '#662572'
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

controller.hears('.*', ['direct_message', 'direct_mention'], function (bot, message) {
  bot.reply(message, 'Sorry <@' + message.user + '>, I don\'t understand. \n')
})

// experimentations with slash commands

controller.on('slash_command',function(bot,message) {

    // reply to slash command
    bot.replyPublic(message,'Everyone can see this part of the slash command');
    bot.replyPrivate(message,'Only the person who used the slash command can see this.');

})
