import fs from "fs";
import path from "path";

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".tsx")) files.push(p);
  }
  return files;
}

function fixFile(file) {
  let c = fs.readFileSync(file, "utf8");
  if (!c.includes("motion.div") && !c.includes("</motion.div>")) return;

  const lines = c.split(/\r?\n/);
  const stack = [];
  const out = [];

  for (const line of lines) {
    if (/<motion\.div[\s>]/.test(line) && !line.includes("</motion.div>")) {
      stack.push("m");
      out.push(line);
    } else if (/<div[\s>]/.test(line) && !/<motion\.motion.div/.test(line) && !line.includes("</")) {
      stack.push("d");
      out.push(line);
    } else if (/<\/motion\.motion.div>/.test(line) || /<\/motion\.div>/.test(line)) {
      const t = stack.pop();
      out.push(t === "m" ? line : line.replace("</motion.div>", "</div>"));
    } else {
      out.push(line);
    }
  }
  fs.writeFileSync(file, out.join("\n"));
  console.log("fixed", path.basename(file), "stack leftover", stack.length);
}

walk("d:/whatsapp saas ai/src").forEach(fixFile);
