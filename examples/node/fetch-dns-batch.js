var TmLabs = require('../../dist/tmlabs.umd')
/* eslint-disable new-cap */
var tmLabs = new TmLabs['default']({
  limit: 2
})
var pendingTimerId = setInterval(function () { // timer for checking pending requests
  console.log('[ PENDING REQUESTS: ]', tmLabs.pending)
}, 300)

tmLabs.on('error', function (error, command) {
  console.error("[ ERROR '" + command.method + "' ]", error.message)
})
tmLabs.on('response', function (command, response) {
  console.info("[ RESPONSE '" + command.method + "' ]", response.content)
  console.log('[ BALANCE ]', command.balanceRemaining) // return Remaining Balance
})
tmLabs.on('command', function (command, args) {
  console.log("[ COMMAND '" + command.method + "' ] history size: ", tmLabs.history.length, ', pending: ', tmLabs.pending)
})
tmLabs.on('resolved', function (command, args) {
  console.log("[ RESOLVED '" + command.method + "' ] history size: ", tmLabs.history.length, ', pending: ', tmLabs.pending)
})
var domains = ['google.com', 'facebook.com', 'ibm.com', 'example.com', 'assadasf', '127.0.0.1']
tmLabs.fetchBatch('dns', domains.map(function (domain) {
  return {
    domain: domain
  }
}), {throw: true}).then(function (responses) {
  console.log('[ RESPONSES ]', responses.length)
  console.log('History after DNS command batch. history size: ', tmLabs.history.length)
  clearInterval(pendingTimerId)
})
console.log('History with one pending request. history size: ', tmLabs.history.length, ', pending: ', tmLabs.pending)
