import fs from 'fs'
import path from 'path'

import neo4j, { session } from "neo4j-driver"

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'letmein')
)

const createSkill = `
CREATE (b: Skill {
    name: $skillName,
    description: $desc
}) return b
`

const createAbilityScore = `
CREATE (a: AbilityScore {
    name: $abilityName,
    shortName: $shortName,
    description: $desc
})
`

const createRels = (skillNames) =>`
MATCH (a: AbilityScore)
WHERE a.name = $abilityName
MATCH (b: Skill)
WHERE b.name IN [${skillNames}]
CREATE (a) - [ra: HAS_SKILL] -> (b)
CREATE (b) - [rb: ABILITY] -> (a)
return a.name
`

const ablilityScores = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/AbilityScores.json')).toString())
const skills = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Skills.json')).toString())

export default function() {
    ablilityScores.map(abilityScore => {
            const abilitySkills = skills.filter(skill => 
                skill.ability_score.name === abilityScore.name)
            const session = driver.session()
            session.run(createAbilityScore, {
                abilityName: abilityScore.full_name,
                shortName: abilityScore.name,
                desc: abilityScore.desc.reduce((accu, curr) => `${accu} ${curr}`)
            }).then(result => {
                session.close()
            })
        })
    skills.map(skill => {
        const session = driver.session()
        session.run(createSkill, {
            skillName: skill.name,
            desc: skill.desc.reduce((accu, curr) => `${accu} ${curr}`)
        }).then(res => {
            session.close()
        })
    })
    ablilityScores.map(ability => {
        const abilitySkills = skills
            .filter(skill => 
                skill.ability_score.name === ability.name)
            .reduce((accu, curr, i) => {
                if (i === 0) {
                    return `'${curr.name}'`
                } else {
                    return `${accu}, '${curr.name}'`
                }
            }, '')
        const session = driver.session()
        session.run(createRels(abilitySkills), {
            abilityName: ability.full_name
        }).then(res => session.close())
    })
}
