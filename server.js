'use strict'

const express = require('express')
const Slapp = require('slapp')
const BeepBoomConvoStore = ('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')
if (!process.env.PORT) throw Error('PORT missing but required')

var slapp = Slapp({ 
    convo_store: BeepBoomConvoStore(),
    context: BeepBoopContext()
})

var app = slapp.attachToExpress(express())

slapp.message('^(hi|hello|hey).*', ['direct_mention', 'direct_message'], (msg, text, match1) => {
  msg.say(`${greeting}, how are you?`).route('handleHowAreYou', { what: match1 })  // where to route the next msg in the conversation
})

// register a route handler
slapp.route('handleHowAreYou', (msg, state) => {
  // respond with a random entry from array
  msg.say([':smile:, Me too', 'Noted', 'That is interesting'])
})

app.get('/', function (req,res){
    res.send('Hello')
})

console.log('Listening on:' + process.env.PORT)
app.listen(process.env.PORT)