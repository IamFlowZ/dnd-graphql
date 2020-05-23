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

const races = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Races.json")).toString()
);
const languages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../sources/Languages.json")).toString()
);

async function createLanguages() {
  const createScripts = await languages
    .reduce((accu, curr) => {
      if (curr.script.length && !accu.includes(curr.script))
        accu.push(curr.script);
      return accu;
    }, [])
    .map(async (script) => {
      const session = driver.session();
      await session.run(`CREATE (a:Script {name: $name})`, { name: script });
      await session.close();
      return true;
    });
  await Promise.all(createScripts).catch((err) => console.error(err));

  const createLanguages = await languages
    .reduce((accu, curr) => {
      if (curr.name.length && !accu.includes(curr.name))
        accu.push({ name: curr.name, type: curr.type });
      return accu;
    }, [])
    .map(async (lang) => {
      const session = driver.session();
      await session.run(`CREATE (a:Language {name: $name, type: $type})`, {
        name: lang.name,
        type: lang.type,
      });
      await session.close();
      return true;
    });
  await Promise.all(createLanguages).catch((err) => console.error(err));

  const relateLanguagesScripts = await languages.map(async (lang) => {
    const session = driver.session();
    await session.run(
      `MATCH (a:Language{name:$langName})
        MATCH(b:Script{name:$scriptName})
        CREATE (b) <- [c:HAS_SCRIPT] - (a)`,
      {
        langName: lang.name,
        scriptName: lang.script,
      }
    );
    await session.close();
    return true;
  });
  await Promise.all(relateLanguagesScripts).catch((err) => console.error(err));

  const createRaces = await races
    .reduce((accu, curr) => {
      if (curr.name.length && !accu.includes(curr.name)) accu.push(curr.name);
      return accu;
    }, [])
    .map(async (name) => {
      const session = driver.session();
      await session.run(`CREATE (a:Race {name: $name})`, { name });
      await session.close();
      return true;
    });
  await Promise.all(createRaces).catch((err) => console.error(err));

  const allOfThem = await races.map(async (race) => {
    const relateLangsRaces = await race.languages.map(async (lang) => {
      const session = driver.session();
      await session.run(
        `MATCH(a:Language {name:$langName})
            MATCH(b:Race {name:$raceName})
            CREATE (b) - [c:SPEAKS] -> (a)
            `,
        {
          langName: lang.name,
          raceName: race.name,
        }
      );
      await session.close();
      return true;
    });
    await Promise.all(relateLangsRaces).catch((err) => console.error(err));
  });
  await Promise.all(allOfThem).catch((err) => console.error(err));
  await driver.close();
  return true;
}

export default createLanguages;
