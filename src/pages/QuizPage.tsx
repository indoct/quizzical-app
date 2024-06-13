import { useLoaderData } from "react-router-dom";
import QABlock from "../components/QABlock";
import { useState, useEffect, ChangeEvent } from "react";
import { Questions, SingleQuestion, QuizState } from "../types";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

const QuizPage: React.FC = () => {
  const loaderData = useLoaderData() as { quizData: Promise<any> };
  const [quizState, setQuizState] = useState<QuizState>({
    selected_count: false,
    game_active: false,
  });
  const [quizArray, setQuizArray] = useState<Questions[]>([]);
  const [loading, setLoading] = useState(true);

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
            selected: "",
          };
        });
        setQuizArray(processedData);
        setQuizState((prevState) => {
          return { ...prevState, game_active: true };
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to process quiz data:", error);
        setLoading(false);
      });
  }, [loaderData]);

  useEffect(() => {
    if (quizState.game_active) {
      const selectedCount = quizArray.filter(
        (x) => x.selected.length > 0
      ).length;
      const allSelected = selectedCount === quizArray.length;
      setQuizState((prevState) => ({
        ...prevState,
        selected_count: allSelected,
      }));
    }
  }, [quizArray, quizState.game_active]);

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

  function checkAnswers(): number {
    const correctAnswers = quizArray.filter(
      (ans) => ans.correct === ans.selected
    ).length;
    return correctAnswers;
  }

  const handleCheckBtn = (): void => {
    setQuizState((prevState) => ({
      ...prevState,
      game_active: !prevState.game_active,
    }));
    checkAnswers();
  };

  const handleReplayBtn = (): void => {
    setQuizState((prevState) => ({
      selected_count: !prevState.selected_count,
      game_active: !prevState.game_active,
    }));
  };

  return (
    <form id="quiz-body">
      <QABlock data={quizArray} handleChange={handleChange} />
      <div className="btn-container">
        {!quizState.game_active ? (
          <>
            <p className="answer-text">
              You scored {checkAnswers()}/{quizArray.length} correct answers.
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
              disabled={!quizState.selected_count || !quizState.game_active}
              id="check-answer"
            >
              Check Answers
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default QuizPage;
