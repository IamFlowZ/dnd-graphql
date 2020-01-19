import express from 'express'
import {express as voyagerMiddleware} from 'graphql-voyager/middleware'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import {makeAugmentedSchema} from 'neo4j-graphql-js'
import neo4j from "neo4j-driver"

import Schema from './schema/schema'
const mySchema = new Schema()
const typeDefs = mySchema.typeDefs
const resolvers = mySchema.resolvers
const modifiedSchema = makeAugmentedSchema({typeDefs})

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

// Leaving both types of servers in until json has been entirely moved over into neo4j
//  Neo4J
const server = new ApolloServer({schema: modifiedSchema, context: {driver}})
//  JSON Files
// const server = new ApolloServer({typeDefs, resolvers, context: {driver}})
const app = express()
app.use('/voyager', voyagerMiddleware({endpointUrl: '/graphql'}))
server.applyMiddleware({app})

app.listen({port: 4000}, () => {
    console.log("Listening on port 4000")
})