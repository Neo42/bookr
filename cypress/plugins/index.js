module.exports = (_, config) => {
  config.baseUrl = 'http://localhost:3000'
  Object.assign(config, {
    integrationFolder: 'cypress/e2e',
  })
  return config
}
