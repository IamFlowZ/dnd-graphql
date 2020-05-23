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

const proficiencies = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, "../sources/Proficiencies.json"))
    .toString()
);

const createProf = `CREATE (a:Proficiency{name:$name, type:$type})`;
const relateProf = (names) => `
MATCH (a:Proficiency{name:$name})
MATCH (b)
WHERE b.name IN [${names}]
WITH b, CASE WHEN ['Race', 'Class'] IN LABELS(b)
CREATE (b) - [:HAS_PROF] -> (a)
`;

async function createProficiencies() {
  const createProfs = proficiencies.map((prof) => {
    if (!(prof.type === "Skills" || prof.type === "Saving Throws")) {
      const session = driver.session();
      return session.run(createProf, { ...prof });
    }
  });
  await Promise.all(createProfs).catch((err) => console.error(err));
  const relateProfs = proficiencies.map(async (prof) => {
    if (!(prof.type === "Skills" || prof.type === "Saving Throws")) {
      const classes = prof.classes.reduce((accu, curr, i) => {
        if (i === 0) {
          return `'${curr.name}'`;
        } else {
          return `${accu}, '${curr.name}'`;
        }
      }, "");
      const races = prof.races.reduce((accu, curr, i) => {
        if (i === 0) {
          return `'${curr.name}'`;
        } else {
          return `${accu}, '${curr.name}'`;
        }
      }, "");
      //   console.log(classes, races, prof.name);
      if (classes.length && races.length) {
        const session = driver.session();
        console.log(relateProf(`${classes}, ${races}`));
        return session.run(relateProf(`${classes}, ${races}`), {
          name: prof.name,
        });
      } else if (classes.length) {
        const session = driver.session();
        return session.run(relateProf(classes), { name: prof.name });
      } else if (races.length) {
        const session = driver.session();
        return session.run(relateProf(races), { name: prof.name });
      }
    }
  });
  // await Promise.all(relateProfs).catch(err => console.error(err));
  await driver.close();
}
export default createProficiencies;
