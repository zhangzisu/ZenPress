const fs = require("fs");

let files = fs.readdirSync(".");

let list = [];

files.forEach(file => {
  let stat = fs.statSync(file);
  if (stat.isFile() && file.endsWith(".vue")) {
    list.push(file.substr(0, file.length - 4));
  }
});

let output = [];

list.forEach(val => output.push(`import ${val} from "./${val}.vue";`));
output.push("");
output.push(`export { ${list.join(", ")} };`);
output.push("");

fs.writeFileSync("index.js", output.join("\r\n"));
