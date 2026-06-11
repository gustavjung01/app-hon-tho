import { createServer } from "vite";

const server = await createServer({
  root: process.cwd(),
  configFile: false,
  logLevel: "error"
});

try {
  const { assertEngineFixtures } = await server.ssrLoadModule("/src/engine/fixtures.ts");
  const results = assertEngineFixtures();
  const summary = results.reduce(
    (acc, item) => {
      acc.total += 1;
      acc.byGroup[item.group] = (acc.byGroup[item.group] ?? 0) + 1;
      return acc;
    },
    { total: 0, byGroup: {} }
  );

  console.log(`Tu Tru engine fixtures passed: ${summary.total}/${summary.total}`);
  Object.entries(summary.byGroup).forEach(([group, count]) => {
    console.log(`- ${group}: ${count}`);
  });
} finally {
  await server.close();
}
