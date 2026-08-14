import Fastify from 'fastify'
import routes from './routes/routes.js'
import fastifyPostgres from '@fastify/postgres'
import prismaConnector from './plugins/prismaConnector.js'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const fastify = Fastify({
  logger: true
})

fastify.register(fastifyPostgres, {
  connectionString: process.env.DATABASE_URL
})

fastify.register(swagger, {
  openapi: {
    info: {
      title: "Ring API",
      description: "REST API featuring fictional planets and celestial bodies from The Expanse universe",
      version: "1.0.0"
    }
  }
})

fastify.register(swaggerUi, {
  routePrefix: '/docs'
})

fastify.register(routes)
fastify.register(prismaConnector)

const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()