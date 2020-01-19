import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import {makeAugmentedSchema} from 'neo4j-graphql-js'
import neo4j from "neo4j-driver"

import Schema from './schema/schema'
const mySchema = new Schema()
const typeDefs = mySchema.typeDefs
const resolvers = mySchema.resolvers
const modifiedSchema = makeAugmentedSchema({typeDefs})
import seed from './seed/index'
const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

// Leaving both types of servers in until json has been entirely moved over into neo4j
//  Neo4J
const server = new ApolloServer({schema: modifiedSchema, context: {driver}})
//  JSON Files
// const server = new ApolloServer({typeDefs, resolvers, context: {driver}})
server.listen().then(({url}) => {
    seed()
    console.log(`Listening on: ${url}`)
})