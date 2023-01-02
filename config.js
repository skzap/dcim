let config = {
  version: '0.1.0',
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

// let config = {
//   version: '0.1.0',
//   rootDirectory: '/home/dr/Coding/dcim/',
//   master: {
//     ip: '127.0.0.1',
//     ws: {
//       port: 4545,
//       pingInterval: 10000
//     },
//     http: {
//       port: 4546,
//       siteName: "Eiffel Cloud"
//     }
//   },
//   slave: {
//     ws: {
//       pingInterval: 11000,
//       monitorInterval: 5000,
//       reconnectInterval: 5000
//     }
//   }
// }

export default config