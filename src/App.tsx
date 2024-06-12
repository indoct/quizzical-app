import { useState, useEffect, ChangeEvent } from "react";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import Confetti from "react-confetti";
import "./App.css";
import QABlock from "./components/QABlock";
import Intro from "./components/Intro";
import { QuizState, Settings, Questions, SingleQuestion } from "./types";
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

function App(): JSX.Element {
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizArray, setQuizArray] = useState<Questions[]>([]);
  const [quizState, setQuizState] = useState<QuizState>({
    selected_count: false,
    game_over: false,
  });
  const [quizSettings, setQuizSettings] = useState<Settings>({
    difficulty: "",
    category: "",
  });
  const [isDarkMode, setDarkMode] = useState<boolean>(checkUserTheme);

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const shuffle = (array: string[]): string[] => {
    for (let i = array.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      array.push(array[randomIndex]);
      array.splice(randomIndex, 1);
    }
    return array;
  };

  const generateAPIConfig = (): string => {
    const { difficulty, category } = quizSettings;
    let configString = `https://opentdb.com/api.php?amount=5`;
    return category && difficulty
      ? configString + `&category=${category}&difficulty=${difficulty}`
      : !difficulty && category
      ? configString + `&category=${category}`
      : !category && difficulty
      ? configString + `&difficulty=${difficulty}`
      : configString;
  };

  function fetchData(): void {
    const apiUrl = generateAPIConfig();
    fetch(`${apiUrl}`)
      .then((res) => res.json())
      .then((data) => {
        setQuizArray(
          data.results.map((q: SingleQuestion) => {
            console.log(q);
            const correctAns = decode(q.correct_answer);
            const decodedInc = q.incorrect_answers.map((a) => decode(a));
            const allOptions = [correctAns, ...decodedInc];

            return {
              id: nanoid(),
              question: decode(q.question),
              correct: correctAns,
              incorrect: decodedInc,
              options: shuffle(allOptions),
              selected: "",
            };
          })
        );
      })
      .then(() => {
        if (!quizStarted) setQuizStarted((prevState) => !prevState);
      });
  }

  function handleSettingsChange(e: ChangeEvent<HTMLSelectElement>): void {
    const { name, value } = e.target;
    setQuizSettings((prevSettings) => {
      return name === "difficulty" && value !== "any"
        ? { ...prevSettings, difficulty: value }
        : name === "difficulty" && value === "any"
        ? { ...prevSettings, difficulty: "" }
        : name === "category" && value !== "any"
        ? { ...prevSettings, category: value }
        : name === "category" && value === "any"
        ? { ...prevSettings, category: "" }
        : prevSettings;
    });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const target = e.target as HTMLButtonElement;
    const { value, dataset } = target;
    if (!quizState.game_over) {
      setQuizState((prevState) => {
        const newCount =
          quizArray.filter((x) => x.selected.length > 0).length + 1;
        return newCount === quizArray.length
          ? { ...prevState, selected_count: !prevState.selected_count }
          : prevState;
      });

      for (const quizItem of quizArray) {
        const optArray = quizItem.options;
        if (quizItem.id === dataset.id) {
          for (const optItem of optArray) {
            const qid = quizItem.id;
            if (value === optItem) selectOption(value, qid);
          }
        }
      }
    }

    function selectOption(val: string, qid: string): void {
      setQuizArray((prevQuestions) =>
        prevQuestions.map((question) => {
          return question.id === qid
            ? { ...question, selected: val }
            : question;
        })
      );
    }
  }

  const qaElements: JSX.Element[] = quizArray.map((q, i) => {
    return (
      <QABlock
        key={q.id}
        qid={q.id}
        qnum={`${i + 1}`}
        selected={q.selected}
        question={q.question}
        options={q.options}
        correct={q.correct}
        handleChange={handleChange}
        quizState={quizState}
        isDarkMode={isDarkMode}
      />
    );
  });

  function checkAnswers(): number {
    const correctAnswers = quizArray.filter(
      (ans) => ans.correct === ans.selected
    ).length;
    return correctAnswers;
  }

  const handleCheckBtn = (): void => {
    setQuizState((prevState) => ({
      ...prevState,
      game_over: !prevState.game_over,
    }));
    setQuizSettings((prevSettings) => {
      return { ...prevSettings, difficulty: "", category: "" };
    });
    checkAnswers();
  };

  const handleReplayBtn = (): void => {
    setQuizState((prevState) => ({
      selected_count: !prevState.selected_count,
      game_over: !prevState.game_over,
    }));
    setQuizStarted((prevState) => !prevState);
  };

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
      {quizStarted ? (
        <section>
          {quizState.game_over && checkAnswers() === quizArray.length && (
            <Confetti />
          )}
          <form id="quiz-body">{qaElements}</form>
          <div className="btn-container">
            {quizState.game_over ? (
              <>
                <p className="answer-text">
                  You scored {checkAnswers()}/{quizArray.length} correct
                  answers.
                </p>
                <button onClick={handleReplayBtn}>Play Again</button>
              </>
            ) : (
              <>
                <p className="answer-text">
                  {!quizState.selected_count
                    ? "Please select an answer for every question"
                    : "Good to go!"}
                </p>
                <button
                  onClick={handleCheckBtn}
                  disabled={!quizState.selected_count || quizState.game_over}
                  id="check-answer"
                >
                  Check Answers
                </button>
              </>
            )}
          </div>
        </section>
      ) : (
        <Intro
          handleSettingsChange={handleSettingsChange}
          handleStart={fetchData}
        />
      )}
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
}

export default App;
