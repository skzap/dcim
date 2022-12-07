import WebSocket from 'ws';
import config from './config.js'
import monitor from './monitor.js'

let ws = {
  client: null,
  pingTimeout: null,
  init: function() {
    function heartbeat() {
      clearTimeout(ws.pingTimeout);
      ws.pingTimeout = setTimeout(() => {
        ws.client.terminate();
      }, config.slave.ws.pingInterval);
    }
    
    ws.client = new WebSocket('ws://'+config.master.ip+':'+config.master.ws.port);
    
    ws.client.on('open', () => {
      heartbeat()
      console.log('Connected to master on '+config.master.ip+':'+config.master.ws.port)
    });
    ws.client.on('ping', heartbeat);
    ws.client.on('close', function clear() {
      clearTimeout(ws.pingTimeout);
    });

    setInterval(() => {
      console.log('sending monitor')
      ws.client.send(JSON.stringify({
        type: 'monitor',
        data: monitor
      }))
    }, config.slave.ws.monitorInterval)
  },
}

export default ws