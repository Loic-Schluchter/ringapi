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
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1, description: 'Page number, starting at 1' },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Number of results per page (max 100)' },
                    type: { type: 'string', enum: ['Terrestrial', 'Gas-giant', 'Ice-giant', 'Ice dwarf', 'Earth-like'], description: 'Filter by planet type, e.g. Gas-giant' },
                    colonized: { type: 'string', enum: ['Yes', 'No'], description: 'Filter by colonization status' },
                    name: { type: 'string', description: 'Partial, name search' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    type: { type: 'string' },
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
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                total: { type: 'integer' },
                                totalPages: { type: 'integer' }
                            }
                        }
                    }
                },
            },

        },


    }, async (request, reply) => {
        try {

            const { page, limit, type, colonized, name } = request.query
            const skip = (page - 1) * limit
            const where = {}
            if (type) {
                where.type = { equals: type, mode: 'insensitive' }
            }
            if (colonized) where.colonized = colonized
            if (name) {
                where.name = {
                    contains: name,
                    mode: 'insensitive'
                }
            }
            const [allPlanets, total] = await Promise.all([
                fastify.prisma.planet.findMany({
                    where,
                    orderBy: {
                        id: "asc"
                    },
                    skip: skip,
                    take: limit,
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
                }),
                fastify.prisma.planet.count({ where })
            ])

            if (!allPlanets) {
                return reply.code(404).send({ error: 'Planets not found' })
            }
            return {
                data: allPlanets,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
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
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1, description: 'Page number, starting at 1' },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Number of results per page (max 100)' },
                    name: { type: 'string', description: 'Partial, name search' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        data: {
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
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                total: { type: 'integer' },
                                totalPages: { type: 'integer' }
                            }
                        }
                    }
                },

            },
        }
    }, async (request, reply) => {
        try {

            const { page, limit, name } = request.query
            const skip = (page - 1) * limit
            const where = {}
            if (name) {
                where.name = {
                    contains: name,
                    mode: 'insensitive'
                }
            }
            const [allMoons, total] = await Promise.all([
                fastify.prisma.moon.findMany({
                    where,
                    orderBy: {
                        id: "asc"
                    },
                    skip: skip,
                    take: limit,
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
                }),
                fastify.prisma.moon.count({ where })
            ])

            if (!allMoons) {
                return reply.code(404).send({ error: 'Moons not found' })
            }
            return {
                data: allMoons,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
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
            },
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
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

    fastify.get('/systems', {
        schema: {
            description: 'Returns all systems',
            tags: ['Systems'],
            querystring: {
                type: 'object',
                properties: {
                    page: { type: 'integer', minimum: 1, default: 1, description: 'Page number, starting at 1' },
                    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10, description: 'Number of results per page (max 100)' },
                    name: { type: 'string', description: 'Partial, name search' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    name: { type: 'string' },
                                    slug: { type: 'string' },
                                    description: { type: 'string' },
                                }
                            }
                        },
                        pagination: {
                            type: 'object',
                            properties: {
                                page: { type: 'integer' },
                                limit: { type: 'integer' },
                                total: { type: 'integer' },
                                totalPages: { type: 'integer' }
                            }
                        }
                    }
                },
            },
        }
    }, async (request, reply) => {
        try {

            const { page, limit, name } = request.query
            const skip = (page - 1) * limit
            const where = {}
            if (name) {
                where.name = {
                    contains: name,
                    mode: 'insensitive'
                }
            }
            const [allSystems, total] = await Promise.all([
                fastify.prisma.system.findMany({
                    where,
                    orderBy: {
                        id: "asc"
                    },
                    skip: skip,
                    take: limit,
                }),
                fastify.prisma.system.count({ where })
            ])

            if (!allSystems) {
                return reply.code(404).send({ error: 'Systems not found' })
            }
            return {
                data: allSystems,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        } catch (err) {
            reply.status(500).send(err)
        }
    })


    fastify.get('/systems/:system', {
        schema: {
            description: 'Returns a single system by slug, including its planets',
            tags: ['Systems'],
            params: {
                type: 'object',
                properties: {
                    system: { type: 'string', description: 'System slug, e.g. sol-system' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        stars: { type: 'integer' },
                        colonized: { type: 'string' },
                        species: { type: 'string' },
                        government: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    name: { type: 'string' },
                                    type: { type: 'string' },
                                }
                            }
                        },
                        planets: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer' },
                                    name: { type: 'string' }
                                }
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
            const { system } = request.params

            const foundSystem = await fastify.prisma.system.findFirst({
                where: {
                    slug: { contains: system, mode: 'insensitive' }
                },
                include: {
                    planets: { select: { id: true, name: true } },
                    government: { select: { id: true, name: true, type: true } }
                }

            })

            if (!foundSystem) {
                return reply.code(404).send({ error: 'System not found' })
            }

            return foundSystem
        } catch (error) {
            reply.status(500).send(error)
        }
    });
}

export default routes
