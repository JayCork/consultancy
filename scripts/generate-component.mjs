import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Usage: pnpm gen:ui atoms TextArea
const category = process.argv[2]; // atoms, molecules, templates, etc.
const componentName = process.argv[3];

const validCategories = [
  "atoms",
  "molecules",
  "organisms",
  "templates",
  "pages",
];

if (!category || !componentName || !validCategories.includes(category)) {
  console.error(`Usage: pnpm gen:ui <category> <ComponentName>`);
  console.error(`Valid categories: ${validCategories.join(", ")}`);
  process.exit(1);
}

// Target path: packages/ui/src/components/atoms/TextArea
const targetDir = path.resolve(
  __dirname,
  `../packages/ui/src/components/${category}`,
  componentName,
);

if (fs.existsSync(targetDir)) {
  console.error(`Component ${componentName} already exists in ${category}!`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// --- Templates ---
const cssContent = `.base {\n  /* Styles for ${componentName} */\n}\n`;

const tsxContent = `import styles from "./${componentName}.module.css";

interface ${componentName}Props {
  // Define your props here
}

export const ${componentName} = (props: ${componentName}Props) => {
  return (
    <div class={styles.base}>
      ${componentName} ${category.slice(0, -1)}
    </div>
  );
};
`;

const storyContent = `import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { ${componentName} } from "./${componentName}";

const meta: Meta<typeof ${componentName}> = {
  component: ${componentName},
  title: "${category.charAt(0).toUpperCase() + category.slice(1)}/${componentName}",
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {},
};
`;

// --- Write Files ---
fs.writeFileSync(
  path.join(targetDir, `${componentName}.module.css`),
  cssContent,
);
fs.writeFileSync(path.join(targetDir, `${componentName}.tsx`), tsxContent);
fs.writeFileSync(
  path.join(targetDir, `${componentName}.stories.tsx`),
  storyContent,
);

// --- Handle Central Export ---
// This assumes you have an index.ts in each category folder,
// or one main index.ts in src.
const indexPath = path.resolve(__dirname, `../packages/ui/src/index.ts`);
if (fs.existsSync(indexPath)) {
  const exportLine = `export * from "./components/${category}/${componentName}/${componentName}";\n`;
  fs.appendFileSync(indexPath, exportLine);
}

console.log(`✅ ${componentName} created in components/${category}`);
