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
            magicSchools: (parent, args): Array<MagicSchool> =>
                (args.name) ?
                    this.schools
                        .filter((school: SourceMagicSchool )=> 
                            school['name'].toLowerCase() === args.name.toLowerCase()
                        ).map((school: SourceMagicSchool )=>
                            new MagicSchool(school)
                        ) :
                    this.schools
                        .map((school: SourceMagicSchool )=>
                            new MagicSchool(school)
                        )
        },
        mutations: {}
    }
}