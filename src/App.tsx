import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const checkUserTheme = (): boolean => {
  const storedValue = localStorage.getItem("isDarkMode");
  if (storedValue === null) {
    return false;
  }
  try {
    return JSON.parse(storedValue);
  } catch (e) {
    console.error("Failed to parse stored isDarkMode value:", e);
    return false;
  }
};

const App: FC = () => {
  const [isDarkMode, setDarkMode] = useState<boolean>(checkUserTheme);

  const toggleDarkMode = (checked: boolean): void => {
    setDarkMode(checked);
    localStorage.setItem("isDarkMode", JSON.stringify(checked));
  };

  return (
    <main className={isDarkMode ? "dark-mode" : "light-mode"}>
      <div className="mode-switch">
        <DarkModeSwitch
          style={{ marginBottom: "2rem" }}
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={30}
        />
      </div>
      <section>
        <h1>Quizzical</h1>
        <Outlet />
      </section>
      <footer>
        developed with ❤ by{" "}
        <strong>
          <a href="https://scho.pro" target="_blank">
            scho.
          </a>
        </strong>
      </footer>
    </main>
  );
};

export default App;
