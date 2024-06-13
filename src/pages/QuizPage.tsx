import { useLoaderData, useNavigate } from "react-router-dom";
import QABlock from "../components/QABlock";
import { useState, useEffect, ChangeEvent } from "react";
import { Questions, SingleQuestion, QuizState } from "../types";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

const QuizPage: React.FC = () => {
  const loaderData = useLoaderData() as { quizData: Promise<any> };
  const [quizState, setQuizState] = useState<QuizState>({
    selected_count: false,
    active: false,
  });
  const [quizArray, setQuizArray] = useState<Questions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const shuffle = (array: string[]): string[] => {
    for (let i = array.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      array.push(array[randomIndex]);
      array.splice(randomIndex, 1);
    }
    return array;
  };

  useEffect(() => {
    loaderData.quizData
      .then((data) => {
        const processedData = data.results.map((q: SingleQuestion) => {
          const correctAns = decode(q.correct_answer);
          const decodedInc = q.incorrect_answers.map((a) => decode(a));
          const allOptions = [correctAns, ...decodedInc];

          return {
            id: nanoid(),
            question: decode(q.question),
            correct: correctAns,
            incorrect: decodedInc,
            options: shuffle(allOptions),
            category: decode(q.category),
            selected: "",
          };
        });
        setQuizArray(processedData);
        setQuizState((prevState) => {
          return { ...prevState, active: true };
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error.name, error.message);
        console.error("Failed to process quiz data:", error);
        setError(`Failed to fetch quiz data: ${error.message}`);
        setLoading(false);
      });
  }, [loaderData]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const handleNewSettings = (): void => {
    navigate("/");
  };

  if (error) {
    return (
      <div className="error-block">
        <h2>Sorry, an unexpected error has occurred.</h2>
        <p>{error}</p>
        <button>Try Again</button>
      </div>
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
        <p className="answer-text">{uiMessage()}</p>
        {quizState.active ? (
          <button
            type="button"
            onClick={handleCheckBtn}
            disabled={!quizState.selected_count || !quizState.active}
            id="check-answer"
          >
            Check Answers
          </button>
        ) : (
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
