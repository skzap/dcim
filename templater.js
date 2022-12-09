import {default as Mustache} from 'mustache'
import {promises as fs} from 'fs'

let constants = {
  siteName: 'Eiffel Cloud'
}

let templater = {
  templates: {},
  init: async () => {
    let files = [
      'root','index','login','signup','user'
    ]
    for (let i = 0; i < files.length; i++)
      templater.templates[files[i]] = await fs.readFile('./templates/'+files[i]+'.html', 'utf8')
    templater.root = Mustache.render(templater.templates.root, constants)
    console.log("Templates initialized")
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
  user: async (data) => {
    let root = Mustache.render(templater.templates.root, Object.assign(data, constants))
    let user = Mustache.render(templater.templates.user, Object.assign(data, constants))
    return root.replace('@@CONTENT@@', user)
  }
}

export default templater