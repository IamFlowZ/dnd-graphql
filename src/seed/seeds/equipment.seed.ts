import fs from "fs";
import path from "path";

import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const categories = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/EquipmentCategories.json"))
    .toString()
);
const equipment = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Equipment.json")).toString()
);

export default function () {}
