const fs = require('fs');
let content = fs.readFileSync('app/landing/page.tsx', 'utf8');

// 1. Add imports
const imports = `
import { motion, useScroll, useTransform } from "framer-motion";
import SmoothScroll from "@/src/components/ui/SmoothScroll";
`;
content = content.replace('import { useRef } from "react";', `import { useRef } from "react";\n${imports}`);

// 2. Add ParallaxImg component
const parallaxImgDef = `
function ParallaxImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return <motion.img ref={ref} {...props as any} style={{ y, ...props.style }} />;
}
`;
content = content.replace('export default function LandingPage() {', `${parallaxImgDef}\nexport default function LandingPage() {`);

// 3. Replace <img with <ParallaxImg
content = content.replace(/<img([\s\S]*?)\/>/g, (match, p1) => {
  return `<ParallaxImg${p1}/>`;
});

// 4. Wrap with SmoothScroll
content = content.replace(
  '(',
  '(\n    <SmoothScroll>'
);
// we need to be careful with the first return(. Actually let's just replace the exact return statement:
content = content.replace(
  '  return (\n    <div\n      className="bg-black min-h-screen text-white overflow-x-hidden"',
  '  const { scrollY } = useScroll();\n  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);\n  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);\n\n  return (\n    <SmoothScroll>\n    <div\n      className="bg-black min-h-screen text-white overflow-x-hidden"'
);

// close SmoothScroll at the bottom
content = content.replace(
  '    </div>\n  );\n}\n',
  '    </div>\n    </SmoothScroll>\n  );\n}\n'
);

// 5. Parallax Hero Backgrounds
content = content.replace(
  '<div className="absolute inset-0 z-0 pointer-events-none">',
  '<motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: heroY, opacity: heroOpacity }}>'
);
content = content.replace(
  // close tag for the liquid ether div, the next line is network arcs
  /          <\/div>\n\n          \{\/\* Network arcs/g,
  '          </motion.div>\n\n          {/* Network arcs'
);

// also parallax the network arcs svg exactly
content = content.replace(
  /<svg\n\s*className="absolute inset-0 w-full h-full pointer-events-none"/g,
  '<motion.svg\n            style={{ y: heroY, opacity: heroOpacity }}\n            className="absolute inset-0 w-full h-full pointer-events-none"'
);
content = content.replace(
  /          <\/svg>\n\n          \{\/\* Center content/g,
  '          </motion.svg>\n\n          {/* Center content'
);

// 6. Section headers Typography Reveal
const h2Regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/g;
content = content.replace(h2Regex, (match, p1, inner) => {
  if (inner.includes('Watch together') || inner.includes('Pro-grade features') || inner.includes('Fast. Reliable')) {
    return `<motion.h2${p1} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>${inner}</motion.h2>`;
  }
  return match;
});

// Fix any missing types/issues
// The network arcs svg replace needs the </svg> substituted with </motion.svg>

fs.writeFileSync('app/landing/page.tsx', content);
console.log('Modification complete');
