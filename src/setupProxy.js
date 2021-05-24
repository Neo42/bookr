module.exports = (app) => {
  app.get(/^\/$/, (_, res) => res.redirect('/reading'))
}
