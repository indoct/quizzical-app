import { Fragment } from "react";
import { QABlockProps } from "../types";

import { UilCheckCircle } from "@iconscout/react-unicons";
import { UilTimesCircle } from "@iconscout/react-unicons";

const QABlock: React.FC<QABlockProps> = ({ data, handleChange, quizState }) => {
  return (
    <div>
      {data.map((question, i) => {
        const qnum: number = i + 1;
        return (
          <>
            {/* <span className="cat">{question.category}</span> */}
            <fieldset key={question.id}>
              <legend>{question.question}</legend>
              <div className="opt-container">
                <div className="options">
                  {question.options.map((option, i) => {
                    const optId: string = `${qnum}0${i + 1}-${option}`;
                    return (
                      <Fragment key={optId}>
                        <input
                          className={
                            question.selected === option ? "selected" : ""
                          }
                          type="radio"
                          id={optId}
                          name={option}
                          checked={question.selected === option}
                          value={option}
                          data-id={question.id}
                          onChange={handleChange}
                        />
                        <label
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
                          key={option}
                          htmlFor={optId}
                        >
                          {option}
                        </label>
                      </Fragment>
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
          </>
        );
      })}
    </div>
  );
};

export default QABlock;
