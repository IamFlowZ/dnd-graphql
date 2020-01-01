import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Skill {
    name: string
    description: string
    abilityScore: string
    constructor({name, desc, ability_score}: SourceSkill) {
        this.name = name
        this.description = desc[0]
        this.abilityScore = ability_score['name']
    }
}

interface SourceSkill {
    name: string;
    desc: Array<string>;
    ability_score: object;
}

export default class SkillsTypeDef extends BaseTypeDef {
    skills: Array<object>
    constructor() {
        super(`
            type Skill {
                name: String
                description: String
                abilityScore: String
            }
        `,`
            skills(name: String): [Skill]
        `,``)
        this.skills = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Skills.json')).toString())
    }
    resolvers = {
        queries: {
            skills: (parent, args): Array<Skill> => 
                (args.name) ?
                    this.skills
                        .filter((skill: SourceSkill) =>
                            skill.name === args.name
                        )
                        .map((skill: SourceSkill) =>
                            new Skill(skill)
                        ) :
                    this.skills
                        .map((skill: SourceSkill) =>
                            new Skill(skill)
                        )
        },
        mutations: {}
    }
}