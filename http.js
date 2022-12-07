import express from 'express'
import monitor from './monitor.js'
import config from './config.js'
import hosts from './hosts.js'

let http = {
  init: function() {
    const app = express()

    app.get('/', (req, res) => {
      res.send({
        master: monitor,
        hosts: hosts.list
      })
    })
    
    app.listen(config.master.http.port, () => {
      console.log(`Master API started on port ${config.master.http.port}`)
    })
  }
}

export default http