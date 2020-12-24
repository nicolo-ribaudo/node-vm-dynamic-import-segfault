const path = require("path");
const fs = require("fs");
const vm = require("vm");

runInVM(path.resolve("./source/index.js"));

function runInVM(filename) {
  const dirname = path.dirname(filename);
  const code = fs.readFileSync(filename, "utf8");

  return new vm.Script(`(async function (require) {${code} })`, {
    displayErrors: true,
    filename,
    async importModuleDynamically(specifier) {
      const filename = require.resolve(specifier, { paths: [dirname] });

      console.log("import()", specifier);

      let mod = new vm.SourceTextModule(fs.readFileSync(filename, "utf8"));
      await mod.link(() => {});
      await mod.evaluate();
      return mod;
    },
  }).runInThisContext()(function _require(specifier) {
    const filename = require.resolve(specifier, { paths: [dirname] });
    return runInVM(filename);
  });
}
