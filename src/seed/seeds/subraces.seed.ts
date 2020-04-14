import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const subraces = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Subraces.json")).toString()
);

const CREATE_SUBRACE = `
MATCH (a:Race{name:$raceName})
CREATE (b:Subrace{
	name: $name, 
	description: $desc
}),
	(a) - [:HAS_SUBRACE] -> (b),
	(b) - [:SUBRACE_OF] -> (a)
`;

const SUBRACE_SPEAKS = `
MATCH (a:Subrace{name:$name}),
	(b:Language)
WHERE b.name IN $languages
CREATE (a) - [:SPEAKS] -> (b)
`;

export default async function () {
  const createSubraces = await subraces.map(async (subrace) => {
    const session = driver.session();
    await session.run(CREATE_SUBRACE, {
      raceName: subrace.race.name,
      name: subrace.name,
      desc: subrace.desc,
    });
    await session.close();
    return true;
  });
  await Promise.all(createSubraces).catch((err) => console.error(err));
  await driver.close();
  return true;
}
