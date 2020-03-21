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
    `
}