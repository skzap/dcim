let config = {
  version: '0.1.1',
  rootDirectory: '/root/dcim/',
  master: {
    ip: '192.168.1.193',
    ws: {
      port: 4545,
      pingInterval: 10000
    },
    http: {
      port: 4546,
      siteName: "Eiffel Cloud"
    }
  },
  slave: {
    ws: {
      pingInterval: 11000,
      monitorInterval: 5000,
      reconnectInterval: 5000
    }
  }
}

// COMMENT FOR PRODUCTION
config.rootDirectory = '/home/dr/Coding/dcim/'
config.master.ip = '127.0.0.1'
// END COMMENT

export default config