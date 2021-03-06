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

const subclasses = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Subclasses.json")).toString()
);

const CREATE_SUBCLASS = `
MATCH (a:Class{name:$className})
CREATE (b:Subclass{name:$name, flavor:$flavor, description:$desc}),
	(a) - [:HAS_SUBCLASS] -> (b),
	(b) - [:SUBCLASS_OF] -> (a)
`;

async function createSubclasses() {
  const createSubclasses = await subclasses.map(async (subclass) => {
    const session = driver.session();
    await session.run(CREATE_SUBCLASS, {
      className: subclass.class.name,
      name: subclass.name,
      desc: subclass.desc,
      flavor: subclass.subclass_flavor,
    });
    await session.close();
    return true;
  });
  await Promise.all(createSubclasses).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createSubclasses;
