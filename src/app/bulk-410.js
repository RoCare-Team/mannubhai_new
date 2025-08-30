const fs = require("fs");

// Read URLs from file
const urls = fs.readFileSync("urls.txt", "utf-8").split("\n").filter(Boolean);

// Generate rewrites to /410 page
const rewrites = urls.map((url) => {
  return `{
    source: '${url.trim()}',
    destination: '/410'
  }`;
});

const output = `
// next.config.js
module.exports = {
  async rewrites() {
    return [
      ${rewrites.join(",\n      ")}
    ]
  },
}
`;

fs.writeFileSync("next.config.mjs", output);
console.log("✅ next.config.js with 410 rewrites generated successfully!");