import fs from "fs";
import path from "path";
import neo4j from "neo4j-driver";

const graphenedbURL =
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost:7687";
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || "neo4j";
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || "neo4j";

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass),
  { encrypted: process.env.NODE_ENV === "production" }
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

const createRels = `
    MATCH (a: AbilityScore)
    WHERE a.name = $abilityName
    MATCH (b: Skill)
    WHERE b.name IN $skillNames
    CREATE (a) - [ra: HAS_SKILL] -> (b)
    CREATE (b) - [rb: ABILITY] -> (a)
    return a.name
`;

const abilityScores = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/AbilityScores.json"))
    .toString()
);
const skills = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Skills.json")).toString()
);

async function createAbilities() {
  const createScores = abilityScores.map(async (abilityScore) => {
    const session = driver.session();
    await session.run(createAbilityScore, {
      abilityName: abilityScore.full_name,
      shortName: abilityScore.name,
      desc: abilityScore.desc.reduce((accu, curr) => `${accu} ${curr}`),
    });
    await session.close();
    return true;
  });
  await Promise.all(createScores).catch((err) => console.error(err));

  const createSkills = skills.map(async (skill) => {
    const session = driver.session();
    await session.run(createSkill, {
      skillName: skill.name,
      desc: skill.desc.reduce((accu, curr) => `${accu} ${curr}`),
    });
    await session.close();
    return true;
  });
  await Promise.all(createSkills).catch((err) => console.error(err));

  const abilitySkillRels = abilityScores.map(async (ability) => {
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
      await session.run(createRels, {
        abilityName: ability.full_name,
        skillNames: ability.skills.reduce((accu, curr) => {
          accu.push(curr.name);
          return accu;
        }, []),
      });
      await session.close();
      return true;
    }
    return null;
  });
  await Promise.all(abilitySkillRels).catch((err) => console.error(err));

  await driver.close();
  return true;
}

export default createAbilities;
