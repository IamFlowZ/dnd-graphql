import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Condition {
    name: string
    description: Array<string>
    constructor({name, desc}: SourceCond) {
        this.name = name
        this.description = desc
    }
}
interface SourceCond {
    name: string;
    desc: Array<string>;
}

export default class ConditionsTypeDef extends BaseTypeDef {
    conditions: Array<SourceCond>
    constructor() {
        super(`
            type Condition {
                name: String
                description: String
            }
        `, `
            conditions(name: String): [Condition]
        `, ``)
    }
}