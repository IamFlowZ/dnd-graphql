import fs from 'fs'
import path from 'path'

import BaseTypeDef from './baseTypeDef'

class Language {
    name: string
    type: string
    script: string
    typicalSpeakers: Array<string>
    //@ts-ignore typical_speakers comes from the data source. will change with move to real data store
    constructor({name, type, script, typical_speakers}: SourceLang) {
        this.name = name
        this.type = type
        this.script = script
        //@ts-ignore typical_speakers comes from the data source. will change with move to real data store
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
            languages: (parent, args): Array<Language> => {
                if(args.name || args.script) {
                    const property = args.name ? "name": "script"
                    return this.languages
                        .filter(language => 
                            language[property].toLowerCase() === args[property].toLowerCase()
                        )
                        .map((language: SourceLang) =>
                            new Language(language)
                        )
                } else {
                    return this.languages
                        .map((language: SourceLang) =>
                            new Language(language)
                        )
                }
            }
        },
        mutations: {

        }
    }
}

