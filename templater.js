import {default as Mustache} from 'mustache'
import {promises as fs} from 'fs'
import config from './config.js'

let constants = {
  siteName: config.master.http.siteName
}

let templater = {
  templates: {},
  scripts: {},
  init: async () => {
    let templates = await fs.readdir(config.rootDirectory+'templates/')
    for (let i = 0; i < templates.length; i++)
      templater.templates[templates[i].split('.')[0]] = await fs.readFile(config.rootDirectory+'templates/'+templates[i], 'utf8')
    console.log(Object.keys(templater.templates).length+" templates initialized")

    templater.scripts = await fs.readdir(config.rootDirectory+'assets/scripts/')
    console.log(Object.keys(templater.scripts).length+" scripts initialized")
  },
  index: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let index = Mustache.render(templater.templates.index, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', index)
  },
  login: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let login = Mustache.render(templater.templates.login, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', login)
  },
  signup: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let signup = Mustache.render(templater.templates.signup, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', signup)
  },
  hosts: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let hosts = Mustache.render(templater.templates.hosts, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', hosts)
  },
  host: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let host = Mustache.render(templater.templates.host, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', host)
  },
  charts: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let charts = Mustache.render(templater.templates.charts, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', charts)
  }
}

export default templater