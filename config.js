let config = {
  master: {
    ip: '192.168.1.193',
    ws: {
      port: 4545,
      pingInterval: 10000
    },
    http: {
      port: 4546
    }
  },
  slave: {
    ws: {
      pingInterval: 11000,
      monitorInterval: 5000
    }
  }
}

export default config