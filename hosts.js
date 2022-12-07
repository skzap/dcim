let hosts = {
  list: {},
  update: (monitor) => {
    let hostname = monitor.os.hostname
    hosts.list[hostname] = monitor
  }
}

export default hosts