const fs = require("fs");

const modules = ["auth", "database", "firestore", "messaging", "storage"];
for (const module of modules) {
    const packageJson = {
        main: `../lib/${module}/index.js`,
        types: `../lib/${module}/index.d.ts`,
        sideEffects: false,
        exports: {
            ".": {
                default: `../lib/${module}/index.js`,
                browser: `../lib/${module}/index.browser.js`,
                node: `../lib/${module}/index.node.js`,
            },
        },
    };

    if (!fs.existsSync(module)) {
        fs.mkdirSync(module);
    }
    fs.writeFileSync(`${module}/package.json`, JSON.stringify(packageJson, undefined, 4));
}
