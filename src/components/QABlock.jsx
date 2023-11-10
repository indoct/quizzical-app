import React from "react"
import { nanoid } from 'nanoid'

export default function QABlock(props) {
    const gO = props.quizState.game_over;
    const optArray=props.options.map(option => {
        return option
    })

    const optionsElement = optArray.map((answer, index) => {

    const styles = { 
        color: !gO && props.selected === answer && props.isDarkMode ? "#0f1422" // game in play, dark mode, selected: quiz dark
        : !gO && props.isDarkMode || !gO && props.selected === answer && !props.isDarkMode ? "#f4f4f4" // game in play, dark mode OR game over, selected, light mode: quiz light
        : gO && props.selected !== answer && props.correct !== answer && props.isDarkMode ? "#9fa2ac" // game over, not selected, not correct, dark mode: pale grey
        :  "#0f1422",
        backgroundColor: !gO && props.selected === answer && !props.isDarkMode ? "#2d313c" // game in play, light mode, selected: quiz dark
        : !gO && props.selected === answer && props.isDarkMode ? "#c4b4ed" // game in play, dark mode, selected: quiz light
        : !gO && props.isDarkMode || gO && props.selected !== answer && props.correct !== answer && props.isDarkMode ? "#2a3040" // game in play, dark mode, not selected OR game over, not selected: slightly darker blue #9fa2ac
        : gO && props.selected === answer && props.correct !== props.selected ? "#FF7370" // any mode, game over, incorrect: red
        : gO && props.correct === answer ? "#7edd8c" // any mode, game over, correct: green
        : "#f4f4f4",

        fontWeight: gO && props.correct === answer && props.isDarkMode ? "600" : "500", // bold correct answers in dark mode
        opacity: gO && props.correct === answer || !gO ? 1 : 0.65, // lower opacity for incorrect answers
        cursor: !gO ? 'pointer' : '', // UX: regular cursor after game over
    }

    const optId = `${props.qnum}0${index+1}-${answer}`
    
          return (
                <React.Fragment key={optId}>
                    <input
                      className={props.selected===answer ? 'selected' : ''}
                      type="radio"
                      id={optId}
                      name={answer}
                      checked={props.selected===answer}
                      value={answer}
                      data-id={props.qid}
                      onChange={(e) => props.handleChange(e)}
                      />
                  <label 
                    className="ans-display"
                    key={answer} 
                    htmlFor={optId} 
                    style={styles}>{answer}</label>
                  </React.Fragment>
          );
        });
             
              
              return (
                  
              <fieldset>
                  <legend>{props.question}</legend>
                  <div className="opt-container">
                    <div className="options">
                        {optionsElement}
                    </div>
                        <div>{gO && <span className="ui-feedback"><img src={props.selected === props.correct ? '/src/assets/check.svg' : '/src/assets/cross.svg'}></img></span>}</div>
                  </div>
                          
              </fieldset>
          )
      }