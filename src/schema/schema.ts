import LanguageTypeDef from './languages'
import MagicSchoolsTypeDef from './magicSchools'
import ConditionsTypeDef from './conditions'

const languageDef = new LanguageTypeDef()
const magicSchoolDef = new MagicSchoolsTypeDef()
const conditionDef = new ConditionsTypeDef()

export default class Schema {
    typeDefs = `
        ${languageDef.types}
        ${magicSchoolDef.types}
        ${conditionDef.types}

        type Query {
            ${languageDef.queries}
            ${magicSchoolDef.queries}
            ${conditionDef.queries}
        }
        type Mutation {
            test: String
            ${languageDef.mutations}
            ${magicSchoolDef.mutations}
            ${conditionDef.mutations}
        }
        
    `
    resolvers = {
        Query: {
            ...languageDef.resolvers.queries,
            ...magicSchoolDef.resolvers.queries,
            ...conditionDef.resolvers.queries
        },
        Mutation: {
            ...languageDef.resolvers.mutations,
            ...magicSchoolDef.resolvers.mutations,
            ...conditionDef.resolvers.mutations
        }
    }
}