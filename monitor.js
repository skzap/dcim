import os from 'node:os'
import {exec} from 'child_process'
import config from './config.js'

let monitor = {
  os: {},
  gpu: {},
  disks: [],
  sensors: {},
  ver: config.version,
  init: () => {
    // GPU
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

    refreshDisks()
    refreshSensors()
    
    // all other information
    for (const fname in os) {
      if (typeof os[fname] === 'function') {
        if (fname == 'setPriority')
          continue
        monitor.os[fname] = os[fname]()
      }
    }
    for (const network in monitor.os.networkInterfaces) {
      let net = monitor.os.networkInterfaces[network]
      for (let i = 0; i < net.length; i++) {
        if (!net[i].internal && net[i].family == 'IPv4')
          monitor.os.ip = net[i].address
      }
    }
    setInterval(() => {
      refreshSpecs()
      refreshDisks()
      refreshSensors()
    }, 5000)
    function refreshSpecs() {
      monitor.os.cpus = os.cpus()
      monitor.os.freemem = os.freemem()
      monitor.os.loadavg = os.loadavg()
      monitor.os.uptime = os.uptime()
    }

    function refreshDisks() {
      // disks storage
      exec('df -t ext4', (error, stdout, stderr) => {
        let lines = stdout.split('\n')
        lines.splice(0,1)
        lines.splice(lines.length-1,1)

        let disks = []
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i]
          line = line.split(' ')
          for (let y = line.length-1; y >= 0; y--)
            if (line[y] === '')
              line.splice(y,1)
          disks.push({
            filesystem: line[0],
            size: line[1],
            used: line[2],
            avail: line[3],
            use_percent: line[4],
            mounted_on: line[5]
          })
        }
        monitor.disks = disks
      });
    }

    function refreshSensors() {
      // sensors
      exec('sensors -j', (error, stdout, stderr) => {
        monitor.sensors = JSON.parse(stdout)
      })
    }
  }
}

export default monitor