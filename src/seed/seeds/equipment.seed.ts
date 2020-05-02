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

export default async function () {
  const createEquipment = categories.map(async (category) => {
    const fullEquipmentList = category.equipment.map(
      (item) => equipment.filter((fullItem) => fullItem.name === item.name)[0]
    );
    fullEquipmentList.map(async (completeItem) => {
      const session = driver.session();
      await session.run(`CREATE (a:Equipment:${category.name}{name:})`, {});
      await session.close();
      return true;
    });
  });
  await Promise.all(createEquipment).catch((err) => console.error(err));
  return true;
}
