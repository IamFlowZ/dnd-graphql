import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Language {
    name: string
    type: string
    script: string
    typicalSpeakers: Array<string>
    
    constructor({name, type, script, typical_speakers}: SourceLang) {
        this.name = name
        this.type = type
        this.script = script
        this.typicalSpeakers = typical_speakers
    }
}

interface SourceLang {
    name: string;
    type: string;
    script: string;
    typical_speakers: Array<string>;
}

export default class LanguageTypeDef extends BaseTypeDef {
    languages: Array<SourceLang>
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
            languages: (parent, args): Array<Language> => {
                if(args.name || args.script) {
                    const property = args.name ? "name": "script"
                    return this.languages
                        .filter(language => 
                            language[property].toLowerCase() === args[property].toLowerCase()
                        )
                        .map(language =>
                            new Language(language)
                        )
                } else {
                    return this.languages
                        .map(language =>
                            new Language(language)
                        )
                }
            }
        },
        mutations: {

        }
    }
}

