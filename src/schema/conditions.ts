import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Condition {
    name: string
    description: Array<string>
    constructor({name, desc}) {
        this.name = name
        this.description = desc
    }
}
interface SourceCond {
    name: string;
    desc: Array<string>;
}

export default class ConditionsTypeDef extends BaseTypeDef {
    conditions: Array<object>
    constructor() {
        super(`
            type Condition {
                name: String
                description: [String]
            }
        `, `
            conditions(name: String): [Condition]
        `, ``)
        this.conditions = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Conditions.json')).toString())
    }
    resolvers = {
        queries: {
            conditions: (parent, args): Array<Condition> =>
                (args.name) ?
                    this.conditions
                        .filter((condition: SourceCond) =>
                            condition['name'].toLowerCase() === args.name.toLowerCase()
                        )
                        .map((condition: SourceCond) =>
                            new Condition(condition)
                        ) :
                    this.conditions
                        .map((condition: SourceCond) =>
                            new Condition(condition)
                        )
        },
        mutations: {}
    }
}