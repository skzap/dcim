import os from 'node:os'

let monitor = {
  os: {}
}

for (const fname in os) {
  if (typeof os[fname] === 'function') {
    if (fname == 'setPriority')
      continue
    monitor.os[fname] = os[fname]()
  }
}
setInterval(refreshSpecs, 5000)
function refreshSpecs() {
  monitor.os.cpus = os.cpus()
  monitor.os.freemem = os.freemem()
  monitor.os.loadavg = os.loadavg()
  monitor.os.uptime = os.uptime()
}

export default monitor