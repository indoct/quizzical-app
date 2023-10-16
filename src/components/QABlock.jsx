import React from "react"
import { nanoid } from 'nanoid'

export default function QABlock(props) {
    const optArray=props.options.map(option => {
        return option
    })
    const optionsElement = optArray.map((answer, index) => {
              
    const styles = {
        backgroundColor: props.selected === answer ? "#59E391" : "white"
    }
    const optId = `${props.qnum}0${index+1}-${answer}`  

          return (
                  <label key={answer} htmlFor={optId} style={styles}>
                      {answer}
                      <input
                      type="radio"
                      id={optId}
                      name={answer}
                      checked={props.selected===answer}
                      value={answer}
                      data-id={props.qid}
                      onChange={(e) => props.handleChange(e)}
                      />
                  </label>
          );
        });
             
              
              return (
                  
              <fieldset data-id={props.qid}>
                  <legend>{props.question}</legend>
                          {optionsElement}
              </fieldset>
          )
      }