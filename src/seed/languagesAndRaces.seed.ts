import fs from 'fs'
import path from 'path'

import neo4j, { session } from "neo4j-driver"

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

const races = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Races.json')).toString())
const languages = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Languages.json')).toString())

const thing = `
MERGE(x:Race {name:$name})
MERGE(z:Script {name: $scriptName})
MERGE(y:Language {
    name: $langName, 
    type: $langType
})
MERGE (x) - [:SPEAKS] -> (y)
MERGE (y) - [:HAS_SCRIPT] -> (z)
`

const typicalSpeakers = (typicalSpeakers: Array<string>): string => {
    return ''
    // return typicalSpeakers.reduce((accu, curr) => {

    // })
}

export default function() {
    races.map(race => {
        race.languages.map(raceLanguage => {
            const currLang = languages.filter(lang => lang.name === raceLanguage.name)
            // console.log(race.name, currLang[0].name, currLang[0].type)
            const session = driver.session()
            const params = {
                name: race.name,
                langName: raceLanguage.name,
                langType: currLang[0].type,
                scriptName: currLang[0].script
            }
            console.log(params)
            session.run(thing, params)
            .then(res => {
                session.close()
            }).catch(err => {
                console.error(err)
            })
        })
    })
}