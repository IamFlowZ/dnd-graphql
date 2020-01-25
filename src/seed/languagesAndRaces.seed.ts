import fs from 'fs'
import path from 'path'

import neo4j from "neo4j-driver"

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

const races = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Races.json')).toString())
const languages = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Languages.json')).toString())

/**
 * TODO: Not a big fan of how many times this has to loop over the same data. 
 * However this seems to be the most effective way to get data into the database without recreating nodes
 * Hopefully in the future this can be optimized.
 * */
export default function(): void {
    languages.reduce((accu, curr) => {
        if(curr.script.length && !accu.includes(curr.script))
            accu.push(curr.script)
        return accu
    }, [])
    .map(script => {
        const session = driver.session()
        session.run(`MERGE (a:Script {name: $name}) return a`, {name: script})
            .then(_ => session.close())
            .catch(err => console.error(err))
    })
    languages.reduce((accu, curr) => {
        if(curr.name.length && !accu.includes(curr.name))
            accu.push(curr.name)
        return accu
    }, [])
    .map(lang => {
        const session = driver.session()
        session.run(`MERGE (a:Language {name: $name}) return a`, {name: lang})
            .then(_ => session.close())
            .catch(err => console.error(err))
    })
    languages.map(lang => {
        const session = driver.session()
        session.run(`MATCH (a:Language{name:$langName})
        MATCH(b:Script{name:$scriptName})
        MERGE (b) - [c:HAS_SCRIPT] -> (a)
        return c`, {
            langName: lang.name,
            scriptName: lang.script
        })
        .then(_ => session.close())
        .catch(err => console.error(err))
    })
    races.reduce((accu, curr) => {
        if(curr.name.length && !accu.includes(curr.name))
            accu.push(curr.name)
        return accu
    }, []).map(name => {
        const session = driver.session()
        session.run(`MERGE (a:Race {name: $name})`, {name})
            .then(_ => session.close())
            .catch(err => console.error(err))
    })
    races.map(race => {
        race.languages.map(lang => {
            const session = driver.session()
            session.run(`MATCH(a:Language {name:$langName})
            MATCH(b:Race {name:$raceName})
            MERGE (b) - [c:SPEAKS] -> (a)
            return c
            `, {
                langName: lang.name,
                raceName: race.name
            })
            .then(_ => session.close())
            .catch(err => console.error(err))
        })
    })
}