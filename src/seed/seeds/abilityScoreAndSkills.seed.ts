import fs from "fs";
import path from "path";

import neo4j, { session } from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const createSkill = `
CREATE (b: Skill {
    name: $skillName,
    description: $desc
}) return b
`;

const createAbilityScore = `
CREATE (a: AbilityScore {
    name: $abilityName,
    shortName: $shortName,
    description: $desc
})
`;

const createRels = (skillNames) => `
    MATCH (a: AbilityScore)
    WHERE a.name = $abilityName
    MATCH (b: Skill)
    WHERE b.name IN [${skillNames}]
    CREATE (a) - [ra: HAS_SKILL] -> (b)
    CREATE (b) - [rb: ABILITY] -> (a)
    return a.name
`;

const ablilityScores = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/AbilityScores.json"))
    .toString()
);
const skills = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Skills.json")).toString()
);

export default function () {
  const createScores = ablilityScores.map((abilityScore) => {
    const session = driver.session();
    return session.run(createAbilityScore, {
      abilityName: abilityScore.full_name,
      shortName: abilityScore.name,
      desc: abilityScore.desc.reduce((accu, curr) => `${accu} ${curr}`),
    });
  });
  Promise.all(createScores).catch((err) => console.error(err));
  const createSkills = skills.map((skill) => {
    const session = driver.session();
    return session.run(createSkill, {
      skillName: skill.name,
      desc: skill.desc.reduce((accu, curr) => `${accu} ${curr}`),
    });
  });
  Promise.all(createSkills).catch((err) => console.error(err));
  const abilitySkillRels = ablilityScores.map((ability) => {
    const abilitySkills = skills
      .filter((skill) => skill.ability_score.name === ability.name)
      .reduce((accu, curr, i) => {
        if (i === 0) {
          return `'${curr.name}'`;
        } else {
          return `${accu}, '${curr.name}'`;
        }
      }, "");
    if (abilitySkills.length) {
      const session = driver.session();
      return session.run(createRels(abilitySkills), {
        abilityName: ability.full_name,
      });
    }
    return null;
  });
  Promise.all(abilitySkillRels).catch((err) => console.error(err));
}
