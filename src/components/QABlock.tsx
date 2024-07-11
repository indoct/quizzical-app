import { Fragment } from "react";
import { QABlockProps } from "../types";
import { UilCheckCircle } from "@iconscout/react-unicons";
import { UilTimesCircle } from "@iconscout/react-unicons";

const QABlock: React.FC<QABlockProps> = ({ data, handleChange, quizState }) => {
  // console.log(data);
  return (
    <div>
      {data.map((question, qIndex) => {
        const qnum: number = qIndex + 1;
        return (
          <Fragment key={question.id}>
            <fieldset>
              <legend>{question.question}</legend>
              <div className="opt-container">
                <div className="options">
                  {question.options.map((option, oIndex) => {
                    const optId: string = `${qnum}0${oIndex + 1}-${option}`;
                    return (
                      <div key={optId}>
                        <input
                          className={question.selected}
                          type="radio"
                          id={optId}
                          name={question.id}
                          checked={question.selected === option}
                          value={option}
                          data-id={question.id}
                          onChange={handleChange}
                        />
                        <label
                          // className="answer"
                          className={
                            question.selected === option && quizState.active
                              ? "ans-selected answer"
                              : question.selected === option &&
                                question.selected === question.correct &&
                                !quizState.active
                              ? "ans-selected answer correct"
                              : question.selected === option &&
                                question.selected !== question.correct &&
                                !quizState.active
                              ? "ans-selected answer incorrect go"
                              : question.selected !== option &&
                                option === question.correct &&
                                !quizState.active
                              ? "answer correct go"
                              : !quizState.active
                              ? "answer go"
                              : "answer"
                          }
                          htmlFor={optId}
                        >
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div>
                  {!quizState.active && (
                    <span
                      className={
                        question.selected === question.correct
                          ? "ui-feedback correct"
                          : "ui-feedback incorrect"
                      }
                    >
                      {question.selected === question.correct ? (
                        <UilCheckCircle size={26} color={"#0f1422"} />
                      ) : (
                        <UilTimesCircle size={26} color={"#0f1422"} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </fieldset>
          </Fragment>
        );
      })}
    </div>
  );
};

export default QABlock;
