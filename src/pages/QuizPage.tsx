import { useNavigate, useLocation } from "react-router-dom";
import QABlock from "../components/QABlock";
import { useState, useEffect, ChangeEvent } from "react";
import { Questions, QuizState, QuizError } from "../types";
import { decode } from "html-entities";
import { nanoid } from "nanoid";
import { fetchQuizData } from "../utils/api";
import ErrorCountdown from "../components/ErrorCountdown";

const QuizPage: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    selected_count: false,
    active: false,
  });
  const [quizArray, setQuizArray] = useState<Questions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<QuizError | null>(null);
  const [retrying, setRetrying] = useState<boolean>(false);
  // const [countdown, setCountdown] = useState<number>(5);
  const navigate = useNavigate();
  const location = useLocation();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const shuffle = (array: string[]): string[] => {
    for (let i = array.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      array.push(array[randomIndex]);
      array.splice(randomIndex, 1);
    }
    return array;
  };

  const fetchData = async (
    category: string | null,
    difficulty: string | null
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchQuizData(category, difficulty);
      const processedData = data.results.map((q: any) => {
        const correctAns = decode(q.correct_answer);
        const decodedInc = q.incorrect_answers.map((a: string) => decode(a));
        const allOptions = [correctAns, ...decodedInc];

        return {
          id: nanoid(),
          question: decode(q.question),
          correct: correctAns,
          incorrect: decodedInc,
          options: shuffle(allOptions),
          selected: "",
        };
      });
      setQuizArray(processedData);
      setQuizState((prevState) => {
        return { ...prevState, active: true };
      });
      setLoading(false);
      // setRetrying(false); // Set retrying to false on successful API call
    } catch (err) {
      console.log(err);
      setLoading(false);
      // setRetrying(true);
      setError(err as QuizError);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const difficulty = params.get("difficulty");
    fetchData(category, difficulty);
  }, [location.search]);

  useEffect(() => {
    if (quizState.active) {
      const selectedCount = quizArray.filter(
        (x) => x.selected.length > 0
      ).length;
      const allSelected = selectedCount === quizArray.length;
      setQuizState((prevState) => ({
        ...prevState,
        selected_count: allSelected,
      }));
    }
  }, [quizArray, quizState.active]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value, dataset } = e.target;

    if (dataset.id) {
      selectOption(value, dataset.id);
    }
  };

  const selectOption = (val: string, qid: string): void => {
    setQuizArray((prevQuestions) =>
      prevQuestions.map((question) => {
        return question.id === qid ? { ...question, selected: val } : question;
      })
    );
  };

  function uiMessage(): string {
    return !quizState.selected_count && quizState.active
      ? "Please select an answer for every question"
      : quizState.selected_count && quizState.active
      ? "Good to go!"
      : `You scored ${checkAnswers()}/${quizArray.length} correct answers.`;
  }

  function checkAnswers(): number {
    const correctAnswers = quizArray.filter(
      (ans) => ans.correct === ans.selected
    ).length;
    return correctAnswers;
  }

  const handleCheckBtn = (): void => {
    setQuizState((prevState) => ({
      ...prevState,
      active: !prevState.active,
    }));
    checkAnswers();
  };

  const handleReplayBtn = (): void => {
    navigate(
      `/quiz?category=${new URLSearchParams(window.location.search).get(
        "category"
      )}&difficulty=${new URLSearchParams(window.location.search).get(
        "difficulty"
      )}&t=${Date.now()}`
    );
  };

  const handleRetry = (): void => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const difficulty = params.get("difficulty");
    fetchData(category, difficulty);
  };

  const handleNewSettings = (): void => {
    navigate("/");
  };

  if (loading) {
    return <div>Retrieving and loading trivia questions, please hold...</div>;
  }

  // if (retrying && !loading) {
  //   return <ErrorCountdown initialSeconds={5} />;
  // }

  if (error) {
    return error.response_code !== 5 ? (
      <div className="error-block">
        <h2>Sorry, an unexpected error has occurred: {error.title}</h2>
        <p>{error.message}</p>
        {error.response_code === 1 ? (
          <button type="button" onClick={handleNewSettings}>
            Choose Different Settings
          </button>
        ) : (
          <button onClick={handleRetry}>Try Again</button>
        )}
      </div>
    ) : (
      <ErrorCountdown initialSeconds={5} handleRetry={handleRetry} />
    );
  }

  return (
    <form id="quiz-body">
      <QABlock
        data={quizArray}
        handleChange={handleChange}
        quizState={quizState}
      />
      <div className="feedback">
        {quizState.active && (
          <>
            <p className="answer-text">{uiMessage()}</p>
            <button
              type="button"
              onClick={handleCheckBtn}
              disabled={!quizState.selected_count || !quizState.active}
              id="check-answer"
            >
              Check Answers
            </button>
          </>
        )}{" "}
        {quizState.active && !loading && !quizState.selected_count && (
          <div className="btn-container">
            <button type="button" onClick={handleNewSettings}>
              Change Settings <span className="btn-sub">(← Go Back)</span>
            </button>
            <button type="button" onClick={handleReplayBtn}>
              Play Again <span className="btn-sub">(New Questions)</span>
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default QuizPage;
