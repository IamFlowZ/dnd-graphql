import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const createDmgType = `CREATE (a:DamageType{name:$name, description: $desc})`;
const dmgTypes = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/DamageTypes.json"))
    .toString()
);

export default async function () {
  const createDamages = await dmgTypes.map(async (dmgType) => {
    const session = driver.session();
    await session.run(createDmgType, dmgType);
    await session.close();
    return true;
  });
  await Promise.all(createDamages).catch((err) => console.error(err));
  await driver.close();
  return true;
}
