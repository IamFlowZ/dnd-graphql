import { ApolloServer } from 'apollo-server'

import Schema from './schema/schema'
const mySchema = new Schema()
const typeDefs = mySchema.typeDefs
const resolvers = mySchema.resolvers

const server = new ApolloServer({typeDefs, resolvers, tracing: true})
server.listen().then(({url}) => 
    console.log(`Listening on: ${url}`)
)