import LanguageTypeDef from './languages'
import MagicSchoolsTypeDef from './magicSchools'
import ConditionsTypeDef from './conditions'
import ProficienciesTypeDef from './proficiencies'

const languageDef = new LanguageTypeDef()
const magicSchoolDef = new MagicSchoolsTypeDef()
const conditionDef = new ConditionsTypeDef()
const proficienciesDef = new ProficienciesTypeDef()

export default class Schema {
    typeDefs = `
        ${languageDef.types}
        ${magicSchoolDef.types}
        ${conditionDef.types}
        ${proficienciesDef.types}

        type Query {
            ${languageDef.queries}
            ${magicSchoolDef.queries}
            ${conditionDef.queries}
            ${proficienciesDef.queries}
        }
        type Mutation {
            test: String
            ${languageDef.mutations}
            ${magicSchoolDef.mutations}
            ${conditionDef.mutations}
            ${proficienciesDef.mutations}
        }
        
    `
    resolvers = {
        Query: {
            ...languageDef.resolvers.queries,
            ...magicSchoolDef.resolvers.queries,
            ...conditionDef.resolvers.queries,
            ...proficienciesDef.resolvers.queries
        },
        Mutation: {
            ...languageDef.resolvers.mutations,
            ...magicSchoolDef.resolvers.mutations,
            ...conditionDef.resolvers.mutations,
            ...proficienciesDef.resolvers.mutations
        }
    }
}