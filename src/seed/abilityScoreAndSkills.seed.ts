import fs from 'fs'
import path from 'path'

import neo4j from "neo4j-driver"

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

const createAbilityScore = `
CREATE (b: Skill {
    name: $skillName,
    description: $desc
}),
`

const createSkill = `
CREATE (a: AbilityScore {
    name: $abilityName,
    shortName: $shortName,
    description: $desc,
})
CREATE (a) - [r:HAS_SKILL] -> (b)
CREATE (b) - [r1:ABILITY] -< (a)
`

const ablilityScores = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/AbilityScores.json')).toString())
const skills = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Skills.json')).toString())

ablilityScores.map(abilityScore => {
    console.log(skills.filter(skill => skill.ability_score.name === abilityScore.name))

})