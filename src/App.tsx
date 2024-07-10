import { FC, useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";
import QuizPage from "./pages/QuizPage";

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
  const [category, setCategory] = useState<string>("any");
  const [difficulty, setDifficulty] = useState<string>("any");

  const toggleDarkMode = (): void => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <div
      className={isDarkMode ? "dark-mode container" : "light-mode container"}
    >
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Settings
                setCategory={setCategory}
                setDifficulty={setDifficulty}
              />
            }
          />
          <Route
            path="/quiz"
            element={<QuizPage category={category} difficulty={difficulty} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
