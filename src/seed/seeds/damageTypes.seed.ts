import fs from "fs";
import path from "path";

const createDmgType = `CREATE (a:DamageType{name:$name, description: $desc})`;
const dmgTypes = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/DamageTypes.json"))
    .toString()
);

async function createDmgTypes(driver) {
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
