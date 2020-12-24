const vm = require("vm");

new vm.Script(`
  (async function () {
    // If you remove this, it doesn't crash
    console.log("Started");

    // Wait a bit, otherwise the segfault doesn't happen
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log(await import("./dep"));
  })()
`, {
  async importModuleDynamically() {
    throw new Error("\n\n\nIf you see this error, everything is ok!\n\n\n");
  },
}).runInThisContext();
