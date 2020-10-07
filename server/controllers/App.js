import Controller from './Controller'

export default class App extends Controller {
  constructor(req, res) {
    super(req, res)
    this.req = req
    this.res = res
  }

  index() {
    this.res.render('index', { shop: this.req.session.shop })
  }

  privacy() {
    this.res.render('privacy')
  }

  logout() {
    this.req.session.destroy()
    this.res.redirect('/')
  }
}
