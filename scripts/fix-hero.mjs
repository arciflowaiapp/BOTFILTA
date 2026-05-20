import fs from "fs";

const p = "d:/whatsapp saas ai/src/components/landing/hero.tsx";
const d = "div";
const open = "<" + d;
const close = "</" + d + ">";

const chatPreview = `function ChatPreview() {
  return (
    ${open} className="glass-card rounded-3xl p-1 shadow-premium-lg text-left">
      ${open} className="rounded-[22px] bg-white p-6">
        ${open} className="flex items-center gap-3 border-b border-[#e8eeeb] pb-4">
          ${open} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366]">
            <MessageCircle className="h-5 w-5 text-white" />
          ${close}
          ${open} className="flex-1">
            <p className="font-semibold text-sm">Ahmed Khan</p>
            <p className="text-xs text-[#5c6b63]">Online · WhatsApp</p>
          ${close}
          <Badge variant="whatsapp"><Zap className="mr-1 h-3 w-3 inline" /> AI Active</Badge>
        ${close}
        ${open} className="mt-4 space-y-3">
          ${open} className="chat-bubble-in max-w-[80%] p-3 text-sm">Blue hoodie price?${close}
          ${open} className="chat-bubble-out max-w-[85%] ml-auto p-3 text-sm">
            Our Blue Hoodie is available for <strong>PKR 2,500</strong>. Sizes S-XL in stock. Delivery in 2-3 days.
          ${close}
        ${close}
      ${close}
    ${close}
  );
}`;

let c = fs.readFileSync(p, "utf8");
c = c.replace(/function ChatPreview\(\)[\s\S]*?\n\}/, chatPreview);
c = c.replace(/\n      <\/motion\.div>\n    <\/section>/, "\n      </div>\n    </section>");

fs.writeFileSync(p, c);
console.log("fixed");
