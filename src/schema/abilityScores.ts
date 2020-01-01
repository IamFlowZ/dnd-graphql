import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'
import SkillTypeDef, {Skill} from './skills'

class AbilityScore {
    name: string
    fullName: string
    description: string
    notes: string
    skills: Array<Skill>
    constructor({name, full_name, desc, skills}: SourceAbilityScore) {
        this.name = name
        this.fullName = full_name
        this.description = desc[0]
        this.notes = desc[1]
        this.skills = skills
    }
}

interface SourceAbilityScore {
    name: string;
    full_name: string;
    desc: Array<string>
    skills: Array<Skill>
}

export default class AbilityScoreTypeDef extends BaseTypeDef {
    ablilityScores: Array<SourceAbilityScore>
    constructor() {
        super(`
            type AbilityScore {
                name: String
                fullName: String
                description: String
                notes: String
                skills: [Skill]
            }
        `, `
            abilityScores(name: String, fullName: String, skill: String): [AbilityScore]
        `, ``)
        this.ablilityScores = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/AbilityScores.json')).toString())
        const skillDef = new SkillTypeDef()
        this.ablilityScores = this.ablilityScores.map(ablilityScore => {
            ablilityScore.skills = ablilityScore.skills.map(skill => 
                skillDef.resolvers.queries.skills({}, {name: skill['name']})[0]
            )
            return ablilityScore
        })
    }
    resolvers = {
        queries: {
            abilityScores: (parent, args): Array<AbilityScore> => {
                if(args.name) {
                    return this.ablilityScores
                        .filter(abililtyScore =>
                            abililtyScore.name.toLowerCase() === args.name.toLowerCase()
                        )
                        .map(abilityScore =>
                            new AbilityScore(abilityScore)
                        )
                } else if(args.fullName) {
                    return this.ablilityScores
                        .filter(abililtyScore =>
                            abililtyScore.full_name.toLowerCase() === args.fullName.toLowerCase()
                        )
                        .map(abilityScore =>
                            new AbilityScore(abilityScore)
                        )
                } else if(args.skill) {
                    return this.ablilityScores
                        .filter(abililtyScore => 
                            abililtyScore.skills.filter(score =>
                                score['name'] === args.skill.toLowerCase()
                            ).length
                        )
                        .map(abilityScore =>
                            new AbilityScore(abilityScore)
                        )
                } else {
                    return this.ablilityScores
                        .map(abilityScore =>{
                            console.log(new AbilityScore(abilityScore))
                            return new AbilityScore(abilityScore)
                        })
                }
            }
        },
        mutations: {}
    }
}