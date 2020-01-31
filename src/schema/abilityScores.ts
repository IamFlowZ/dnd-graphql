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
    desc: Array<string>;
    skills: Array<Skill>;
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
    }
}