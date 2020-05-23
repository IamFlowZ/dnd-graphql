import fs from "fs";
import path from "path";
import neo4j from "neo4j-driver";

const graphenedbURL =
  process.env.GRAPHENEDB_BOLT_URL || "bolt://localhost:7687";
const graphenedbUser = process.env.GRAPHENEDB_BOLT_USER || "neo4j";
const graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD || "letmein";

const driver = neo4j.driver(
  graphenedbURL,
  neo4j.auth.basic(graphenedbUser, graphenedbPass),
  { encrypted: process.env.NODE_ENV === "production" }
);

const createClass = `
MATCH (b:AbilityScore)
WHERE b.shortName IN $abilityScores
MERGE (a:Class{name:$name, hitDie: $hitDie})
MERGE (a) - [:SAVES_WITH] -> (b)
return a, b;
`;

const classes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Classes.json")).toString()
);

async function createClasses() {
  const reducer = (accu, curr) => {
    accu.push(curr.name);
    return accu;
  };
  const createClasses = classes.map(async (pClass) => {
    const createParams = {
      abilityScores: pClass.saving_throws.reduce(reducer, []),
      name: pClass.name,
      hitDie: pClass.hit_die,
    };
    const session = driver.session();
    const results = await session.run(createClass, createParams);
    console.log(results);
    await session.close();
    return true;
  });
  await Promise.all(createClasses).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createClasses;
