import React from "react"
import { nanoid } from 'nanoid'

export default function QuestionBlock(props) {
console.log(questions)

const answerElements = props.answers.map((a,i) => {
        const aId = `Q${props.qNum+1}0${i+1}-${a}`

        return (
                <label key={nanoid()} htmlFor={aId}>
                    <input 
                        type="radio"
                        name={props.qid}
                        id={aId}
                        value={a}
                        onChange={props.handleChange}
                    /> {a}
                </label>
        )
    })

    return (
            <fieldset>
                <legend>{props.question}</legend>
                {answerElements}
            </fieldset>
        )
    }