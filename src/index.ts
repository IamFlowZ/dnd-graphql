import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import {makeAugmentedSchema} from 'neo4j-graphql-js'
import neo4j from "neo4j-driver"

import Schema from './schema/schema'
const mySchema = new Schema()
const typeDefs = mySchema.typeDefs
const resolvers = mySchema.resolvers
const modifiedSchema = makeAugmentedSchema({typeDefs})
console.log(modifiedSchema)
const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

const server = new ApolloServer({schema: modifiedSchema, tracing: true, context: {driver}})
server.listen().then(({url}) => 
    console.log(`Listening on: ${url}`)
)