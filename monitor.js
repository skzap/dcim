import os from 'node:os'
import {exec} from 'child_process';

let monitor = {
  os: {},
  gpu: {}
}

exec('lshw -c video', (error, stdout, stderr) => {
  let lines = stdout.split('\n')
  let product, vendor
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('product: ') > -1) {
      product = lines[i].slice(lines[i].indexOf('product: ')+9)
    }
    if (lines[i].indexOf('vendor: ') > -1) {
      vendor = lines[i].slice(lines[i].indexOf('vendor: ')+8)
    }
  }
  monitor.gpu.product = product
  monitor.gpu.vendor = vendor
});

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