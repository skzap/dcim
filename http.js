import express from 'express'
import monitor from './monitor.js'
import config from './config.js'
import hosts from './hosts.js'
import templater from './templater.js'
import db from './db.js'
import { v4 as uuidv4 } from 'uuid'
import {formatBytes} from './commons.js'
import wss from './wss.js'

let http = {
  init: async function() {
    const app = express()
    app.use('/js', express.static('assets/js'))
    app.use('/css', express.static('assets/css'))
    app.use('/img', express.static('assets/img'))
    app.use('/scripts', express.static('assets/scripts'))
    app.use(express.urlencoded({extended:false}))
    app.use(async function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next()
    });

    function parseCookies(req) {
      let cookies = []
      if (req.headers.cookie) {
        cookies = req.headers.cookie.split(';')
        for (let i = 0; i < cookies.length; i++)
          cookies[i] = cookies[i].trim().split('=')
      }
      return cookies
    }

    async function need(needUser, req, res) {
      let user = await getUser(req)
      if (!user && needUser) {
        res.redirect('/login')
        return {end: true, user: null}
      }
      return {end: false, user: user}
    }

    async function getUser(req) {
      let cookies = parseCookies(req)
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i][0] == 'auth') {
          let token = cookies[i][1].split('.')[0]
          let username = cookies[i][1].split('.')[1]
          let user = await db.db.collection('accounts').findOne({_id:username, token:token})
          if (user._id === 'admin')
            user.isAdmin = true
          return user
        }
      }
    }

    function fourOhFour(res) {
      res.status(404).send('<center><h1>404</h1> <a href="/">Go Back</a></center>')
    }

    app.get('/', async (req, res) => {
      let {end, user} = await need(false, req, res)
      if (end) return
      res.send(await templater.index({user: user}))
    })

    // Signup
    app.get('/signup', async function (req, res) {
      let {end, user} = await need(false, req, res)
      if (end) return
      if (user) {
        res.redirect('/')
        return
      }
      res.send(await templater.signup({}))
    })
    app.post('/signup', async function(req, res) {
      res.send("Not implemented")
      return
      let {end, user} = await need(false, req, res)
      if (end) return
      if (user) {
        res.redirect('/')
        return
      }
      if (req.body.password != req.body['password-repeat']) {
        res.send(await templater.signup({error: "Passwords do not match"}))
        return
      }
      if (req.body.password.length < 8) {
        res.send(await templater.signup({error: "Password too short"}))
        return
      }
      if (req.body.username.length < 5) {
        res.send(await templater.signup({error: "Username too short"}))
        return
      }
      let userExist = await db.db.collection('accounts').findOne({_id: req.body.username})
      if (userExist) {
        res.send(await templater.signup({error: "Username already exists"}))
        return
      }
      await db.db.collection('accounts').insertOne({
        _id: req.body.username,
        password: req.body.password,
        created: new Date().getTime()
      })
      res.send(await templater.signup({success: "You can now login with your account"}))
    })

    // Login
    app.get('/login', async function (req, res) {
      let {end, user} = await need(false, req, res)
      if (end) return
      if (user) {
        res.redirect('/')
        return
      }
      res.send(await templater.login({}))
    })
    app.post('/login', async function(req, res) {
      let user = await db.db.collection('accounts').findOne({_id: req.body.username, password: req.body.password})
      if (!user) {
        res.send(await templater.login({error: "Wrong Username or Password"}))
        return
      }
      let token = uuidv4()
      await db.db.collection('accounts').updateOne({_id: req.body.username}, {
        $set: {token: token, lastLogin: new Date().getTime()}
      })
      res.setHeader('Set-Cookie', 'auth='+token+'.'+req.body.username);
      res.redirect('/user')
    })

    // Logout
    app.get('/logout', (req, res) => {
      res.clearCookie('auth');
      res.redirect('/')
    });

    app.get('/hosts', async (req, res) => {
      let {end, user} = await need(true, req, res)
      if (end) return
      if (user._id !== 'admin') {
        res.status(401).send('Unauthorized')
        return
      }

      console.log(hosts.list)
      let hostList = []
      for (const hostname in hosts.list)
        hostList.push(hosts.list[hostname])

      for (let i = 0; i < hostList.length; i++) {
        hostList[i].monitor.os.cpuModel = hostList[i].monitor.os.cpus[0].model
        hostList[i].monitor.os.cpuThreads = hostList[i].monitor.os.cpus.length

        hostList[i].monitor.os.freememDisp = formatBytes(hostList[i].monitor.os.freemem)
        hostList[i].monitor.os.totalmemDisp = formatBytes(hostList[i].monitor.os.totalmem)
      }
      res.send(await templater.hosts({
        user: user,
        hosts: hostList
      }))
    });

    app.get('/host/:hostname', async (req, res) => {
      let {end, user} = await need(true, req, res)
      if (end) return
      if (user._id !== 'admin') {
        res.status(401).send('Unauthorized')
        return
      }
      let hostname = req.params.hostname
      let host = hosts.list[hostname]

      if (!host) {
        fourOhFour(res)
        return
      }

      host.monitor.os.cpuModel = host.monitor.os.cpus[0].model
      host.monitor.os.cpuThreads = host.monitor.os.cpus.length

      host.monitor.os.freememDisp = formatBytes(host.monitor.os.freemem)
      host.monitor.os.totalmemDisp = formatBytes(host.monitor.os.totalmem)
      
      res.send(await templater.host({
        user: user,
        host: host,
        scripts: templater.scripts
      }))
    })

    app.post('/host/:hostname', async (req,res) => {
      let hostname = req.params.hostname
      if (req.body.cmd) {
        wss.server.clients.forEach((ws) => {
          if (ws.host.hostname !== hostname)
            return
          ws.send(JSON.stringify({
            type: 'exec',
            data: req.body.cmd
          }))
        })
      }
      res.redirect('/host/'+hostname)
    })

    // 404
    app.get('*', function(req, res){
      fourOhFour(res)
    })
    
    await db.init()
    await templater.init()
    app.listen(config.master.http.port, () => {
      console.log(`Master API started on port ${config.master.http.port}`)
    })
  }
}

export default http