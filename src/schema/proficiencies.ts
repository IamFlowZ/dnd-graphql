import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Proficiency {
    type: string
    name: string
    classes: Array<string>
    races: Array<string>
    constructor({type, name, classes, races}: SourceProf) {
        this.type = type.toLowerCase()
        this.name = name.toLowerCase()
        this.classes = classes.map(aClass => aClass['name'].toLowerCase())
        this.races = races.map(race => race['name'].toLowerCase())
    }
}

interface SourceProf {
    type: string;
    name: string;
    classes: Array<object>;
    races: Array<object>;
}

export default class ProficienciesTypeDef extends BaseTypeDef {
    proficiencies: Array<SourceProf>
    constructor() {
        super(`
            type Proficiency {
                type: String
                name: String
                classes: [String]
                races: [String]
            }
        `, `
            proficiencies(type: String, name: String, class: String, race: String): [Proficiency]
        `, ``)
    }
}