let hosts = {
  list: {},
  cmdOutput: (hostname, result) => {
    if (result.stdout)
      hosts.list[hostname].cli.out.push(result.stdout)
    if (result.stderr)
      hosts.list[hostname].cli.err.push(result.stderr)
  },
  update: (monitor) => {
    let hostname = monitor.os.hostname
    if (!hosts.list[hostname])
      hosts.list[hostname] = {
        cli: {out: [], err: []}
      }
    hosts.list[hostname].monitor = monitor
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