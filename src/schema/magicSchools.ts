import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

export class MagicSchool {
    name: string
    description: string
    constructor({name, desc}: SourceMagicSchool) {
        this.name = name
        this.description = desc
    }
}

interface SourceMagicSchool {
    name: string;
    desc: string;
}

export default class MagicSchoolsTypeDef extends BaseTypeDef {
    schools: Array<SourceMagicSchool>
    constructor() {
        super(`
            type MagicSchool {
                name: String
                description: String
            }
        `, `
            magicSchools(name: String): [MagicSchool]
        `, ``)
    }
}