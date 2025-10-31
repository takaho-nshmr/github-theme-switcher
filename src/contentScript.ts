import { DEFAULT_THEME_ID, findTheme } from "./themes";

type ThemeMessage = {
  type: "THEME_CHANGE";
  payload: {
    themeId: string;
  };
};

const STYLE_ELEMENT_ID = "github-theme-switcher-style";

const getStyleElement = (): HTMLLinkElement => {
  let link = document.getElementById(
    STYLE_ELEMENT_ID,
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.id = STYLE_ELEMENT_ID;
    link.rel = "stylesheet";
    document.head.append(link);
  }

  return link;
};

const applyTheme = (themeId: string): void => {
  const theme = findTheme(themeId) ?? findTheme(DEFAULT_THEME_ID);

  if (!theme) {
    return;
  }

  const stylesheetUrl = chrome.runtime.getURL(theme.stylesheet);
  const link = getStyleElement();
  link.href = stylesheetUrl;
};

const loadThemePreference = (): Promise<string> =>
  new Promise((resolve) => {
    chrome.storage.sync.get(["selectedTheme"], (result) => {
      const savedTheme =
        typeof result.selectedTheme === "string"
          ? result.selectedTheme
          : DEFAULT_THEME_ID;
      resolve(savedTheme);
    });
  });

const loadInitialTheme = async (): Promise<void> => {
  try {
    const savedTheme = await loadThemePreference();
    applyTheme(savedTheme);
  } catch (error) {
    console.error("[github-theme-switcher] Failed to load stored theme", error);
    applyTheme(DEFAULT_THEME_ID);
  }
};

chrome.runtime.onMessage.addListener(
  (message: ThemeMessage, _sender, sendResponse) => {
    if (message?.type === "THEME_CHANGE") {
      applyTheme(message.payload.themeId);
      sendResponse({ ok: true });
      return true;
    }

    return false;
  },
);

void loadInitialTheme();
