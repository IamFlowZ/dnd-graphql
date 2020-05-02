import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  "bolt://localhost:7687",
  neo4j.auth.basic("neo4j", "letmein")
);

const currencies = [
  {
    name: "Copper",
    to: {
      silver: 10,
      electrum: 50,
      gold: 100,
      platinum: 1000,
    },
  },
  {
    name: "Silver",
    to: {
      copper: 0.1,
      electrum: 5,
      gold: 10,
      platinum: 100,
    },
  },
  {
    name: "Electrum",
    to: {
      copper: 0.02,
      silver: 0.2,
      gold: 2,
      platinum: 20,
    },
  },
  {
    name: "Gold",
    to: {
      copper: 0.01,
      silver: 0.1,
      electrum: 0.5,
      platinum: 10,
    },
  },
  {
    name: "Platinum",
    to: {
      copper: 0.001,
      silver: 0.01,
      electrum: 0.05,
      gold: 0.1,
    },
  },
];

async function createCurrency() {
  const creation = currencies.map(async (currency) => {
    const session = driver.session();
    await session.run("CREATE (a:Currency{name:$name})", {
      name: currency.name,
    });
    await session.close();
  });
  await Promise.all(creation).catch((err) => console.error(err));
  const exchanges = currencies.map(async (currency) => {
    Object.keys(currency.to).map(async (secondCurrency) => {
      const session = driver.session();
      await session.run(
        `
			MATCH (a:Currency{name: $first}), (b:Currency)
			WHERE toLower(b.name) = $second
			CREATE (a) - [:EXCHANGES_AT{rate:$rate}] -> (b)
		`,
        {
          first: currency.name,
          second: secondCurrency,
          rate: currency.to[secondCurrency],
        }
      );
      await session.close();
    });
  });
  await Promise.all(exchanges).catch((err) => console.error(err));
}
export default createCurrency;
