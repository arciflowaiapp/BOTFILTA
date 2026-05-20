import fs from "fs";

const fixes = [
  {
    file: "d:/whatsapp saas ai/src/components/dashboard/sidebar.tsx",
    replacements: [
      ['<motion.div className="flex h-9', '<motion.div className="flex h-9'],
      ['B\n          </motion.div>', 'B\n          </motion.div>'],
      ['      </motion.div>\n      <nav', '      </motion.div>\n      <nav'],
    ],
  },
  {
    file: "d:/whatsapp saas ai/src/components/dashboard/header.tsx",
    replacements: [
      ['      </motion.div>\n      <div className="flex', '      </motion.div>\n      <motion.div className="flex'],
    ],
  },
];

for (const { file, replacements } of fixes) {
  let c = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    c = c.split(from).join(to);
  }
  // Generic: fix </motion.div> after plain <div (not motion)
  c = c.replace(/<div([^>]*)>([\s\S]*?)<\/motion\.motion.div>/g, (m, attrs, inner) => {
    if (inner.includes("<motion.div")) return m;
    return `<div${attrs}>${inner}</div>`;
  });
  fs.writeFileSync(file, c);
  console.log("fixed", file);
}
