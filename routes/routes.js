async function routes(fastify, options) {
    // Welcome route
    fastify.get('/', {
        schema: {
            description: 'Welcome route',
            tags: ['General'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        Hi: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        return { Hi: 'Welcome to Ring API' }
    })

    fastify.get('/planets', {
        schema: {
            description: 'Returns all planets',
            tags: ['Planets'],
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            moons: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: { name: { type: 'string' } }
                                }
                            },
                            system: {
                                type: 'object',
                                properties: { name: { type: 'string' } }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const allPlanets = await fastify.prisma.planet.findMany({
                orderBy: {
                    id: "asc"
                },
                include: {
                    moons: {
                        select: {
                            name: true,
                        }
                    },
                    system: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            if (!allPlanets) {
                return reply.code(404).send({ error: 'Planets not found' })
            }
            return allPlanets
        } catch (err) {
            reply.status(500).send(err)
        }
    });

    fastify.get('/planets/:planet', {
        schema: {
            description: 'Returns a single planet by name (case-insensitive), including its moons and solar system',
            tags: ['Planets'],
            params: {
                type: 'object',
                properties: {
                    planet: { type: 'string', description: 'Planet name, e.g. earth, mars' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        type: { type: 'string' },
                        diameter: { type: 'string' },
                        gravity: { type: 'number' },
                        length_of_day: { type: ['number', 'null'] },
                        length_of_year: { type: 'string' },
                        atmospheric_pressure: { type: 'string' },
                        atmospheric_composition: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    gas: { type: 'string' },
                                    percentage: { type: 'number' }
                                }
                            }
                        },
                        temperature_min: { type: 'integer' },
                        temperature_avg: { type: 'integer' },
                        temperature_max: { type: 'integer' },
                        demonym: { type: 'string' },
                        species: { type: 'string' },
                        population: { type: 'string' },
                        government: { type: 'string' },
                        colonized: { type: 'string' },
                        moons: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                }
                            }
                        },
                        system: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                            }
                        }
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { planet } = request.params
            const formattedName = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase()

            const foundPlanet = await fastify.prisma.planet.findUnique({
                where: { name: formattedName },
                include: {
                    moons: true,
                    system: true,
                }
            })

            if (!foundPlanet) {
                return reply.code(404).send({ error: 'Planet not found' })
            }

            return foundPlanet

        } catch (error) {
            reply.status(500).send(error)
        }
    });

    fastify.get('/moons', {
        schema: {
            description: 'Returns all moons',
            tags: ['Moons'],
            response: {
                200: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            planet: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    name: { type: 'string' }
                                }
                            }
                        }
                    }

                }
            }
        }
    }, async (request, reply) => {
        try {
            const moons = await fastify.prisma.moon.findMany({
                orderBy: {
                    id: "asc"
                },
                select: {
                    name: true,
                    id: true,
                    description: true,
                    planet: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }

            })
            if (!moons) {
                return reply.code(404).send({ error: 'Moons not found' })
            }
            return moons
        } catch (error) {
            reply.status(500).send(error)
        }
    });

    fastify.get('/moons/:moon', {
        schema: {
            description: 'Returns a single moon by name, including its planet',
            tags: ['Moons'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                        planet: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                name: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { moon } = request.params
            const formattedName = moon.charAt(0).toUpperCase() + moon.slice(1).toLowerCase()

            const foundMoon = await fastify.prisma.moon.findUnique({
                where: { name: formattedName },
                select: {
                    name: true,
                    description: true,
                    planet: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            })

            if (!foundMoon) {
                return reply.code(404).send({ error: 'Moon not found' })
            }

            return foundMoon

        } catch (error) {
            reply.status(500).send(error)
        }
    });
}

export default routes
