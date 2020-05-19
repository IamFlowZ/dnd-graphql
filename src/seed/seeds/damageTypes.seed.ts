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

const createDmgType = `CREATE (a:DamageType{name:$name, description: $desc})`;
const dmgTypes = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/DamageTypes.json"))
    .toString()
);

async function createDmgTypes() {
  const createDamages = await dmgTypes.map(async (dmgType) => {
    const session = driver.session();
    await session.run(createDmgType, {
      name: dmgType.name,
      desc: dmgType.desc[0],
    });
    await session.close();
    return true;
  });
  await Promise.all(createDamages).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createDmgTypes;
