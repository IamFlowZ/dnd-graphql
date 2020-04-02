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

export default function() {
  dmgTypes.map(dmgType => {
    const session = driver.session();
    session
      .run(createDmgType, dmgType)
      .then(res => session.close())
      .catch(err => console.error("Error while create damage type: ", err));
  });
}
