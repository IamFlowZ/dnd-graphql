const fs = require('fs')
const path = require('path')
import BaseTypeDef from './baseTypeDef'

class Language {
    name: string
    type: string
    script: string
    typicalSpeakers: Array<string>
    constructor({name, type, script, typical_speakers}) {
        this.name = name
        this.type = type
        this.script = script
        this.typicalSpeakers = typical_speakers
    }
}

export default class LanguageTypeDef extends BaseTypeDef {
    languages: Array<object>
    constructor() {
        super(`
            type Language {
                name: String
                type: String
                script: String
                typicalSpeakers: [String]
            }`, 
            `
                languages(name: String, script: String): [Language]
            `, 
            ``
        )
        this.languages = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Languages.json')).toString())
    }
    resolvers = {
        queries: {
            languages: (parent, args) => {
                console.log('here')
                if(args.name || args.script) {
                    let property = args.name ? "name": "script"
                    return this.languages
                        .filter(language => 
                            language[property].toLowerCase() === args[property].toLowerCase()
                        )
                        .map(language =>
                            //@ts-ignore
                            new Language(language)
                        )
                } else {
                    return this.languages
                }
            }
        },
        mutations: {

        }
    }
}

