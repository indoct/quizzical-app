import React, { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import QABlock from "../components/QABlock";

const QuizPage: React.FC = () => {
  const { quizData } = useLoaderData() as { quizData: Promise<any> };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={quizData}>{(data) => <QABlock data={data} />}</Await>
      </Suspense>
    </div>
  );
};

export default QuizPage;
