import LanguageTypeDef from './languages'
import MagicSchoolsTypeDef from './magicSchools'

const languageDef = new LanguageTypeDef()
const magicSchoolDef = new MagicSchoolsTypeDef()

export default class Schema {
    typeDefs = `
        ${languageDef.types}
        ${magicSchoolDef.types}

        type Query {
            ${languageDef.queries}
            ${magicSchoolDef.queries}
        }
        type Mutation {
            test: String
            ${languageDef.mutations}
            ${magicSchoolDef.mutations}
        }
        
    `
    resolvers = {
        Query: {
            ...languageDef.resolvers.queries,
            ...magicSchoolDef.resolvers.queries
        },
        Mutation: {
            ...languageDef.resolvers.mutations,
            ...magicSchoolDef.resolvers.mutations
        }
    }
}