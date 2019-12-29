import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

export class MagicSchool {
    name: string
    description: string
    constructor({name, desc}) {
        this.name = name
        this.description = desc
    }
}

export default class MagicSchoolsTypeDef extends BaseTypeDef {
    schools: Array<object>
    constructor() {
        super(`
            type MagicSchool {
                name: String
                description: String
            }
        `, `
            magicSchools(name: String): [MagicSchool]
        `, ``)
        this.schools = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/MagicSchools.json')).toString())
    }
    resolvers = {
        queries: {
            magicSchools: (parent, args) =>
                (args.name) ?
                    this.schools
                        .filter(school => 
                            school['name'] === args.name
                        ).map(school =>
                            //@ts-ignore
                            new MagicSchool(school)
                        ) :
                    this.schools
                        .map(school =>
                            //@ts-ignore
                            new MagicSchool(school)
                        )
        },
        mutations: {}
    }
}