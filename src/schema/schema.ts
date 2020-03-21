export default class Schema {
    typeDefs = `
        type Race {
            name: String
            speaks: [Language] @relation(name:"SPEAKS", direction: "OUT")
        }
        type Script {
            name: String
            usedBy: [Language] @relation(name:"HAS_SCRIPT", direction: "IN")
        }
        type Language {
            name: String
            type: String
            script: Script @relation(name: "HAS_SCRIPT", direction: "OUT")
            typicalSpeakers: [Race] @relation(name:"SPEAKS", direction:"IN")
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