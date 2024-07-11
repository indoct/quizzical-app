import { useState, useEffect, ChangeEvent, useRef } from "react";
import QABlock from "../components/QABlock";
import { Questions, QuizState, QuizError } from "../types";
import { decode } from "html-entities";
import { nanoid } from "nanoid";
import { fetchQuizData } from "../utils/api";
import ErrorCountdown from "../components/ErrorCountdown";
import ReactConfetti from "react-confetti";
import { QuizPageProps } from "../types";

const QuizPage: React.FC<QuizPageProps> = ({
  category,
  difficulty,
  gameOver,
  handleNewSettings,
  setGameOver,
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    selected_count: false,
    active: false,
  });
  const [quizArray, setQuizArray] = useState<Questions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<QuizError | null>(null);
  const isFetchCalled = useRef(false);

  const shuffle = (array: string[]): string[] => {
    for (let i = array.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      array.push(array[randomIndex]);
      array.splice(randomIndex, 1);
    }
    return array;
  };

  const fetchData = async () => {
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
      setQuizState((prevState) => ({ ...prevState, active: true }));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err as QuizError);
    }
  };

  useEffect(() => {
    if (!isFetchCalled.current) {
      fetchData();
      isFetchCalled.current = true;
    }
  }, [category, difficulty]);

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
    setQuizArray((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((question) =>
        question.id === qid ? { ...question, selected: val } : question
      );
      return updatedQuestions;
    });
  };

  const uiMessage = (): string => {
    return !quizState.selected_count && quizState.active
      ? "Please select an answer for every question"
      : quizState.selected_count && quizState.active
      ? "Good to go!"
      : `You scored ${checkAnswers()}/${quizArray.length} correct answers.`;
  };

  const checkAnswers = (): number => {
    const correctAnswers = quizArray.filter(
      (ans) => ans.correct === ans.selected
    ).length;
    return correctAnswers;
  };

  const handleCheckBtn = (): void => {
    setQuizState((prevState) => ({ ...prevState, active: !prevState.active }));
    setGameOver(true);
    checkAnswers();
  };

  if (loading) {
    return <div>Retrieving and loading trivia questions, please hold...</div>;
  }

  if (error) {
    return error.response_code !== 5 ? (
      <div className="error-block">
        <h2>Sorry, an unexpected error has occurred: {error.title}</h2>
        <p>{error.message}</p>
        {error.response_code === 1 ? (
          <button className="ui-btn" type="button" onClick={handleNewSettings}>
            Choose Different Settings
          </button>
        ) : (
          <button className="ui-btn" onClick={() => setGameOver(false)}>
            Try Again
          </button>
        )}
      </div>
    ) : (
      <ErrorCountdown
        initialSeconds={5}
        setGameOver={setGameOver}
        fetchData={fetchData}
      />
    );
  }

  return (
    <form id="quiz-body">
      {gameOver && checkAnswers() === quizArray.length && <ReactConfetti />}
      <QABlock
        data={quizArray}
        handleChange={handleChange}
        quizState={quizState}
      />
      <div className="feedback">
        <p className="answer-text">{uiMessage()}</p>
        {quizState.active && (
          <button
            className="ui-btn"
            type="button"
            onClick={handleCheckBtn}
            disabled={!quizState.selected_count || !quizState.active}
            id="check-answer"
          >
            Check Answers
          </button>
        )}
        {gameOver && (
          <div className="btn-container">
            <button
              className="ui-btn"
              type="button"
              onClick={handleNewSettings}
            >
              Change Settings
            </button>
            <button
              className="ui-btn"
              type="button"
              onClick={() => {
                setGameOver(false);
                fetchData();
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default QuizPage;
