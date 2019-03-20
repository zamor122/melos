/* eslint-disable global-require */
const path = require('path')
const fastify = require('fastify')({ logger: true })

// Third-Party
fastify.register(require('fastify-cookie'))
fastify.register(require('fastify-url-data'))
fastify.register(require('fastify-compress'))
fastify.register(require('fastify-favicon'))
fastify.register(require('fastify-static'), { root: path.join(__dirname, './assets'), prefix: '/static-assets' })
fastify.register(require('fastify-caching'), { privacy: 'public', expiresIn: 604800, cache: false })
fastify.register(require('point-of-view'), { engine: { marko: require('marko') } })

// Decorators
fastify.register(require('./decorators/newrelic-decorator'))
fastify.register(require('./decorators/raven-decorator'))
fastify.register(require('./decorators/bible-config-decorator'), { timeout: 0 })

// Plugins
fastify.register(require('./plugins/cors'))
fastify.register(require('./plugins/redirect-authenticated'))
fastify.register(require('./plugins/health-checks'))
fastify.register(require('./plugins/manifest'))
fastify.register(require('./plugins/service-worker'))
fastify.register(require('./plugins/i18n'))
fastify.register(require('./plugins/bible'))
fastify.register(require('./plugins/confirmations'))
fastify.register(require('./plugins/main'))

/* Start Listening on PORT */
const PORT = process.env.PORT || 3030
fastify.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    fastify.captureException(err, 'Error starting Fastify server: ')
    console.log(err)
    process.exit(1)
  }
  fastify.log.info(`Server started listening on ${fastify.server.address().port}`)
})
