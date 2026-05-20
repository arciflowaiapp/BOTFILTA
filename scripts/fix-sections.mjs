import fs from "fs";
const p = "d:/whatsapp saas ai/src/components/landing/sections.tsx";
const lines = fs.readFileSync(p, "utf8").split(/\r?\n/);
lines[77] = '                  <motion.div className="chat-bubble-out p-3 text-sm">{d.a}</motion.div>';
lines[77] = '                  <div className="chat-bubble-out p-3 text-sm">{d.a}</div>';
if (lines[86].includes("motion")) lines[86] = "      </div>";
fs.writeFileSync(p, lines.join("\n"));
console.log("ok");
