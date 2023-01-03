import WebSocket from 'ws';
import config from './config.js'
import monitor from './monitor.js'
import {exec} from 'child_process'

let ws = {
  client: null,
  pingTimeout: null,
  reconnect: null,
  init: function() {
    function heartbeat() {
      clearTimeout(ws.pingTimeout);
      ws.pingTimeout = setTimeout(() => {
        ws.client.terminate();
      }, config.slave.ws.pingInterval);
    }
    
    ws.client = new WebSocket('ws://'+config.master.ip+':'+config.master.ws.port);
    
    ws.client.on('error', (error) => {
      console.log(error)
    })

    ws.client.on('open', () => {
      heartbeat()
      console.log('Connected to master on '+config.master.ip+':'+config.master.ws.port)
      if (ws.reconnect)
        clearInterval(ws.reconnect)

      ws.client.send(JSON.stringify({
        type: 'monitor',
        data: monitor
      }))
    });
    ws.client.on('ping', heartbeat);
    ws.client.on('close', function clear() {
      clearTimeout(ws.pingTimeout);
      if (!ws.reconnect) {
        ws.reconnect = setInterval(() => {
          ws.init()
        }, config.slave.ws.reconnectInterval)
      }
    });

    ws.client.on('message', function (mess) {
      console.log('received message from server')

      mess = JSON.parse(mess)

      switch (mess.type) {
        case 'exec':
          console.log(mess)
          exec('ls', (error, stdout, stderr) => {
            ws.client.send(JSON.stringify({
              type: 'execOut',
              data: {
                error: error,
                stdout: stdout,
                stderr: stderr
              }
            }))
          })
          break;
      
        default:
          break;
      }
    })

    if (!ws.monitored) {
      ws.monitored = setInterval(() => {
        ws.client.send(JSON.stringify({
          type: 'monitor',
          data: monitor
        }))
      }, config.slave.ws.monitorInterval)
    }
  },
}

export default ws