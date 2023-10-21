import React from "react"
import { nanoid } from 'nanoid'

export default function QABlock(props) {
    const gO = props.quizState.game_over;
    const optArray=props.options.map(option => {
        return option
    })

    const optionsElement = optArray.map((answer, index) => {

    const styles = { 
        backgroundColor: !gO && props.selected === answer ? "#96c0c5" 
        : gO && props.selected === answer && props.correct !== props.selected ? "#FF7370"
        : gO && props.correct === answer ? "#6BB389"
        : "#f4f4f4",

        opacity: gO && props.correct === answer || !gO ? 1 : 0.6,
        cursor: !gO ? 'pointer' : '',
    }

    const optId = `${props.qnum}0${index+1}-${answer}`
    
          return (
                <React.Fragment key={nanoid()}>
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
                        {gO && <span className="ui-feedback">{props.selected === props.correct ? '✔️' : '❌'}</span>}
                  </div>
                          
              </fieldset>
          )
      }