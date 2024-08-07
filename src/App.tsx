import { FC, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Settings from "./pages/Settings";
import QuizPage from "./pages/QuizPage";
import { useNavigate } from "react-router-dom";

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
  const [gameOver, setGameOver] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleDarkMode = (): void => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const handleNewSettings = (): void => {
    setGameOver(false);
    navigate("/");
  };

  return (
    <div
      className={isDarkMode ? "dark-mode container" : "light-mode container"}
    >
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleNewSettings={handleNewSettings}
      />
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
            element={
              <QuizPage
                category={category}
                difficulty={difficulty}
                gameOver={gameOver}
                handleNewSettings={handleNewSettings}
                setGameOver={setGameOver}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
