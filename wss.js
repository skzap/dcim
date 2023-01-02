import { WebSocketServer } from 'ws';
import config from './config.js'
import hosts from './hosts.js'

let wss = {
  server: null,
  isAlive: null,
  init: function() {
    function heartbeat() {
      this.isAlive = true;
    }
    
    wss.server = new WebSocketServer({ port: config.master.ws.port });
    
    wss.server.on('connection', function connection(ws, req) {
      ws.isAlive = true;
      
      console.log('New connection from '+req.socket.remoteAddress)

      ws.on('pong', heartbeat);

      ws.on('message', function message(mess) {
        mess = JSON.parse(mess)

        switch (mess.type) {
          case 'monitor':
            ws.host = {}
            ws.host.hostname = mess.data.os.hostname
            hosts.update(mess.data)
            break;

          case 'execOut':
            hosts.cmdOutput(ws.host.hostname, mess.data)
            break;
        
          default:
            break;
        }
      });
    });
    
    const interval = setInterval(function ping() {
      wss.server.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
    
        ws.isAlive = false;
        ws.ping();
      });
    }, config.master.ws.pingInterval);
    
    wss.server.on('close', function close() {
      clearInterval(interval);
      console.log('Connection closed')
    });
  }
}

export default wss