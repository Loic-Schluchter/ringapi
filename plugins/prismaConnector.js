import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js"
import fp from "fastify-plugin"

const connectionString = `${process.env.DATABASE_URL}`;


async function prismaConnector (fastify, option){

    const adapter = new PrismaPg({connectionString})
    console.log("Adapter created")
    const prisma = new PrismaClient({adapter})
    console.log("Prisma client created")

    await prisma.$connect()
    console.log("Prisma connected")

    fastify.decorate('prisma', prisma)
    fastify.addHook('onClose', async (instance) =>{
        await instance.prisma.$disconnect()
    })

}

export default fp(prismaConnector)