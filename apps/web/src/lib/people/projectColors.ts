//  TODO: Remove this. Colors should not be determined by project name. Instead they should provide extra information about the project
export interface ProjectColorSet {
  fill: string;
  text: string;
  border: string;
}

const FALLBACK: ProjectColorSet = {
  fill: "var(--color-overlay)",
  text: "var(--color-text-secondary)",
  border: "var(--color-border-strong)",
};

export function getProjectColors(projectName: string): ProjectColorSet {
  return FALLBACK;
}
