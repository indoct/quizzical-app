import { useLoaderData } from "react-router-dom";
import QABlock from "../components/QABlock";
import { useState, useEffect, ChangeEvent } from "react";
import { Questions, SingleQuestion } from "../types";
import { shuffle } from "../utils/utils";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

const QuizPage: React.FC = () => {
  const loaderData = useLoaderData() as { quizData: Promise<any> };
  const [quizArray, setQuizArray] = useState<Questions[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to process quiz data:", error);
        setLoading(false);
      });
  }, [loaderData]);

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

  return (
    <div>
      <QABlock data={quizArray} handleChange={handleChange} />
    </div>
  );
};

export default QuizPage;
