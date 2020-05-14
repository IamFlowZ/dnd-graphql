import fs from "fs";
import path from "path";

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

function createProficiencies(driver) {
  const createProfs = proficiencies.map((prof) => {
    if (!(prof.type === "Skills" || prof.type === "Saving Throws")) {
      const session = driver.session();
      return session.run(createProf, { ...prof });
    }
  });
  Promise.all(createProfs).catch((err) => console.error(err));
  const relateProfs = proficiencies.map((prof) => {
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
  // Promise.all(relateProfs).catch(err => console.error(err));
}
export default createProficiencies;
