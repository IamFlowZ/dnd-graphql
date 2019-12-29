import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Proficiency {
    type: string
    name: string
    classes: Array<string>
    races: Array<string>
    constructor({type, name, classes, races}: {type: string, name: string, classes: Array<object>, races: Array<object>}) {
        this.type = type.toLowerCase()
        this.name = name.toLowerCase()
        this.classes = classes.map(aClass => aClass['name'].toLowerCase())
        this.races = races.map(race => race['name'].toLowerCase())
    }
}

export default class ProficienciesTypeDef extends BaseTypeDef {
    proficiencies: Array<object>
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
        this.proficiencies = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Proficiencies.json')).toString())
        // console.log(this.proficiencies)
    }
    resolvers = {
        queries: {
            proficiencies: (parent, args) => {
                if(args.type || args.name) {
                    let property = args.type ? "type" : "name"
                    return this.proficiencies
                        .filter(prof =>
                            prof[property] === args[property].toLowerCase()
                        )
                        .map(prof =>
                            //@ts-ignore
                            new Proficiency(prof)
                        )
                } else if(args.class) {
                    return this.proficiencies
                        .filter(prof =>
                            prof[`classes`].includes(args["class"].toLowerCase())
                        )
                        .map(prof =>
                            //@ts-ignore
                            new Proficiency(prof)
                        )
                } else if(args.race) {
                    return this.proficiencies
                        .filter(prof =>
                            prof[`races`].includes(args['race'].toLowerCase())
                        )
                        .map(prof =>
                            //@ts-ignore
                            new Proficiency(prof)
                        )
                } else {
                    return this.proficiencies
                        .map(prof =>
                            //@ts-ignore
                            new Proficiency(prof)
                        )
                }
            }
        },
        mutations: {}
    }
}