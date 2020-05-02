import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const createWeaponProperty = `CREATE (a:WeaponProperty{name:$name, description: $desc}) return a;`;
const props = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/WeaponProperties.json"))
    .toString()
);

async function createWeaponProps() {
  const createProps = await props.map(async (property) => {
    const session = driver.session();
    await session.run(createWeaponProperty, { ...property });
    await session.close();
    return true;
  });
  await Promise.all(createProps).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createWeaponProps;
