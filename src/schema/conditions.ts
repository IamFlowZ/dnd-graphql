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
            conditions: (parent, args) =>
                (args.name) ?
                    this.conditions
                        .filter(condition =>
                            condition['name'].toLowerCase() === args.name.toLowerCase()
                        )
                        .map(condition =>
                            //@ts-ignore
                            new Condition(condition)
                        ) :
                    this.conditions
                        .map(condition =>
                            //@ts-ignore
                            new Condition(condition)
                        )
        },
        mutations: {}
    }
}