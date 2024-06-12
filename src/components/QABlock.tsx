import { Fragment, FC } from "react";
import { UilCheckCircle } from "@iconscout/react-unicons";
import { UilTimesCircle } from "@iconscout/react-unicons";
import { QAProps } from "../types";

const QABlock: FC<QAProps> = ({
  qid,
  qnum,
  selected,
  question,
  options,
  correct,
  handleChange,
  quizState,
  isDarkMode,
}) => {
  const gO = quizState.game_over;

  const optArray = options.map((option) => {
    return option;
  });

  const optionsElement = optArray.map((answer, index) => {
    const styles = {
      color:
        !gO && selected === answer && isDarkMode
          ? "#0f1422" // game in play, dark mode, selected: quiz dark
          : (!gO && isDarkMode) || (!gO && selected === answer && !isDarkMode)
          ? "#f4f4f4" // game in play, dark mode OR game over, selected, light mode: quiz light
          : gO && selected !== answer && correct !== answer && isDarkMode
          ? "#9fa2ac" // game over, not selected, not correct, dark mode: pale grey
          : "#0f1422",
      backgroundColor:
        !gO && selected === answer && !isDarkMode
          ? "#2d313c" // game in play, light mode, selected: quiz dark
          : !gO && selected === answer && isDarkMode
          ? "#c4b4ed" // game in play, dark mode, selected: quiz light
          : (!gO && isDarkMode) ||
            (gO && selected !== answer && correct !== answer && isDarkMode)
          ? "#2a3040" // game in play, dark mode, not selected OR game over, not selected: slightly darker blue #9fa2ac
          : gO && selected === answer && correct !== selected
          ? "#FF7370" // any mode, game over, incorrect: red
          : gO && correct === answer
          ? "#7edd8c" // any mode, game over, correct: green
          : "#f4f4f4",

      fontWeight: gO && correct === answer && isDarkMode ? "600" : "500", // bold correct answers in dark mode
      opacity: (gO && correct === answer) || !gO ? 1 : 0.65, // lower opacity for incorrect answers
      cursor: !gO ? "pointer" : "", // UX: regular cursor after game over
    };

    const optId = `${qnum}0${index + 1}-${answer}`;

    return (
      <Fragment key={optId}>
        <input
          className={selected === answer ? "selected" : ""}
          type="radio"
          id={optId}
          name={answer}
          checked={selected === answer}
          value={answer}
          data-id={qid}
          onChange={(e) => handleChange(e)}
        />
        <label
          className="ans-display"
          key={answer}
          htmlFor={optId}
          style={styles}
        >
          {answer}
        </label>
      </Fragment>
    );
  });

  return (
    <fieldset>
      <legend>{question}</legend>
      <div className="opt-container">
        <div className="options">{optionsElement}</div>
        <div>
          {gO && (
            <span
              className={
                selected === correct
                  ? "ui-feedback correct"
                  : "ui-feedback incorrect"
              }
            >
              {selected === correct ? (
                <UilCheckCircle size={26} color={"#0f1422"} />
              ) : (
                <UilTimesCircle size={26} color={"#0f1422"} />
              )}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default QABlock;
