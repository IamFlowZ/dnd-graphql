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
