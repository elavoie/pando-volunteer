#!/usr/bin/env node
var electronEval = require('electron-eval')

var url = process.argv[2] || 'http://localhost:5000'
var n = process.argv[3] || 1

var daemons = []

var code = 'window.open(' + JSON.stringify(url) + ')'

for (var i = 0; i < n; ++i) {
  // Start each new window with a delay between each to ease
  // connection. Somehow starting all these windows as fast as possible with
  // each making connections prevent some of them from being established.
  setTimeout(function () {
    daemons[i] = electronEval()
    daemons[i].eval(code, function (err, res) {
      if (err) throw err
    })
  }, i * 50)
}

process.on('SIGINT', function () {
  console.log('Caught interrupt signal')
  daemons.forEach(function (d) {
    d.close()
  })
  process.exit()
})
