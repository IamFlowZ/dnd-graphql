export default class Schema {
    typeDefs = `
        type Language {
            name: String
            type: String
            script: String
            typicalSpeakers: [String]
        }
        type AbilityScore {
            name: String
            fullName: String
            description: String
            notes: String
            skills: [Skill]
        }
        type Condition {
            name: String
            description: String
        }
        type MagicSchool {
            name: String
            description: String
        }
        type Proficiency {
            type: String
            name: String
            classes: [String]
            races: [String]
        }
        type Skill {
            name: String
            description: String
            abilityScore: AbilityScore
        }

        type Query {
            languages(name: String, script: String): [Language]
            magicSchools(name: String): [MagicSchool]
            conditions(name: String): [Condition]
            proficiencies(type: String, name: String, class: String, race: String): [Proficiency]
            skills(name: String, abilityScore: String): [Skill]
            abilityScores(name: String, fullName: String, skill: String): [AbilityScore]
        }
    `
}