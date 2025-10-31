import { DEFAULT_THEME_ID, ThemeDefinition, themes } from "../themes";

const formElement = document.getElementById(
  "theme-form",
) as HTMLFormElement | null;

const getStoredTheme = (): Promise<string> =>
  new Promise((resolve) => {
    chrome.storage.sync.get(["selectedTheme"], (result) => {
      const savedTheme =
        typeof result.selectedTheme === "string"
          ? result.selectedTheme
          : DEFAULT_THEME_ID;
      resolve(savedTheme);
    });
  });

const setStoredTheme = (themeId: string): Promise<void> =>
  new Promise((resolve) => {
    chrome.storage.sync.set({ selectedTheme: themeId }, () => resolve());
  });

const queryActiveTab = (): Promise<chrome.tabs.Tab | undefined> =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });

const isGitHubPage = (tab?: chrome.tabs.Tab): boolean => {
  if (!tab?.url) {
    return false;
  }

  try {
    const url = new URL(tab.url);
    return url.hostname === "github.com";
  } catch {
    return false;
  }
};

const sendThemeChange = (tabId: number, themeId: string): Promise<void> =>
  new Promise((resolve) => {
    chrome.tabs.sendMessage(
      tabId,
      {
        type: "THEME_CHANGE",
        payload: { themeId },
      },
      () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[github-theme-switcher] Failed to notify content script",
            chrome.runtime.lastError.message,
          );
        }
        resolve();
      },
    );
  });

const buildOption = (
  theme: ThemeDefinition,
  isChecked: boolean,
): HTMLElement => {
  const label = document.createElement("label");
  label.className = "theme-option";

  const input = document.createElement("input");
  input.type = "radio";
  input.name = "theme";
  input.value = theme.id;
  input.checked = isChecked;

  const span = document.createElement("span");
  span.textContent = theme.label;

  label.append(input, span);

  return label;
};

const renderThemeOptions = async (): Promise<void> => {
  if (!formElement) {
    return;
  }

  const selectedTheme = await getStoredTheme();

  themes.forEach((theme) => {
    const option = buildOption(theme, theme.id === selectedTheme);
    formElement.append(option);
  });

  formElement.addEventListener("change", async (event) => {
    const target = event.target as HTMLInputElement | null;
    if (!target || target.name !== "theme") {
      return;
    }

    const newThemeId = target.value;

    await setStoredTheme(newThemeId);

    const activeTab = await queryActiveTab();
    if (activeTab?.id != null && isGitHubPage(activeTab)) {
      await sendThemeChange(activeTab.id, newThemeId);
    }
  });
};

void renderThemeOptions();
