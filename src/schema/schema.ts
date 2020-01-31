import LanguageTypeDef from './languages'
import MagicSchoolsTypeDef from './magicSchools'
import ConditionsTypeDef from './conditions'
import ProficienciesTypeDef from './proficiencies'
import SkillsTypeDef from './skills'
import AbilityTypeDef from './abilityScores'

const languageDef = new LanguageTypeDef()
const magicSchoolDef = new MagicSchoolsTypeDef()
const conditionDef = new ConditionsTypeDef()
const proficienciesDef = new ProficienciesTypeDef()
const skillsDef = new SkillsTypeDef()
const abilitiesDef = new AbilityTypeDef()

export default class Schema {
    typeDefs = `
        ${languageDef.types}
        ${magicSchoolDef.types}
        ${conditionDef.types}
        ${proficienciesDef.types}
        ${skillsDef.types}
        ${abilitiesDef.types}

        type Query {
            ${languageDef.queries}
            ${magicSchoolDef.queries}
            ${conditionDef.queries}
            ${proficienciesDef.queries}
            ${skillsDef.queries}
            ${abilitiesDef.queries}
        }
        type Mutation {
            ${languageDef.mutations}
            ${magicSchoolDef.mutations}
            ${conditionDef.mutations}
            ${proficienciesDef.mutations}
            ${skillsDef.mutations}
            ${abilitiesDef.mutations}
        }
        
    `
}