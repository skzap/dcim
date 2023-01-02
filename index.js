import config from './config.js'
import http from './http.js'
import wss from './wss.js'
import ws from './ws.js'
import monitor from './monitor.js'

let isMaster = false
if (process.argv[2] == 'master')
  isMaster = true

if (isMaster) {
  http.init()
  wss.init()
} else {
  monitor.init()
  ws.init()
}
