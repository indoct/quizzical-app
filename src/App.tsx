import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

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

  const toggleDarkMode = (): void => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <main className={isDarkMode ? "dark-mode" : "light-mode"}>
      <ThemeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
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
