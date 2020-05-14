import fs from "fs";
import path from "path";

const createWeaponProperty = `CREATE (a:WeaponProperty{name:$name, description: $desc}) return a;`;
const props = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/WeaponProperties.json"))
    .toString()
);

async function createWeaponProps(driver) {
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
