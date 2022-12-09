let hosts = {
  list: {},
  update: (monitor) => {
    let hostname = monitor.os.hostname
    hosts.list[hostname] = monitor
    hosts.list[hostname].lastUpdate = new Date().getTime()
  },
  clear: () => {
    for (const hostname in hosts.list)
      if (new Date().getTime() - hosts.list[hostname].lastUpdate > 15000)
        delete hosts.list[hostname]
  }
}

setInterval(() => {
  hosts.clear()
}, 15000)

export default hosts