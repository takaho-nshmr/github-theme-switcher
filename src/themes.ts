export type ThemeDefinition = {
  id: string;
  label: string;
  stylesheet?: string;
};

export const DEFAULT_THEME_ID = "off";

export const themes: ThemeDefinition[] = [
  {
    id: "off",
    label: "オフ",
  },
  {
    id: "vscode-light",
    label: "VS Code Light",
    stylesheet: "themes/vscode-light.css",
  },
  {
    id: "vscode-dark",
    label: "VS Code Dark",
    stylesheet: "themes/vscode-dark.css",
  },
];

export const findTheme = (themeId: string): ThemeDefinition | undefined =>
  themes.find((theme) => theme.id === themeId);
