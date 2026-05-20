import fs from "fs";
import path from "path";

const files = [
  "d:/whatsapp saas ai/src/components/landing/sections.tsx",
];

for (const file of files) {
  let c = fs.readFileSync(file, "utf8");
  // Fix common pattern: <div ...> ... </motion.div> -> </motion.div>
  c = c.replace(/(<div[^>]*>[\s\S]*?)<\/motion\.div>/g, (match, open) => {
    if (open.includes("<motion.div")) return match;
    return open + "</div>";
  });
  fs.writeFileSync(file, c);
  console.log("fixed", path.basename(file));
}
