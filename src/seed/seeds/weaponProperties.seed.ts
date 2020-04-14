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

export default function () {
  props.map((property) => {
    const session = driver.session();
    session
      .run(createWeaponProperty, { ...property })
      .then((res) => session.close)
      .catch((err) => console.error("Couldn't create property: ", err));
  });
}
