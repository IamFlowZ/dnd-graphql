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
    }
}

