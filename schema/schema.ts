import LanguageTypeDef from './languages'

const languageDef = new LanguageTypeDef()

export default class Schema {
    typeDefs = `
        ${languageDef.types}

        type Query {
            ${languageDef.queries}
        }
        type Mutation {
            test: String
            ${languageDef.mutations}
        }
        
    `
    resolvers = {
        Query: {
            ...languageDef.resolvers.queries
        },
        Mutation: {
            ...languageDef.resolvers.mutations
        }
    }
}