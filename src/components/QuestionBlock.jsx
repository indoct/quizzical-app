import React from "react"
import { nanoid } from 'nanoid'

export default function QuestionBlock(props) {

const answerElements = props.answers.map((a,i) => {
    const akey = nanoid();
    const aId = `Q${props.qNum+1}0${i+1}-${a}`

    return (
            <label key={akey} htmlFor={aId}>
                <input 
                    type="radio"
                    name={props.question}
                    id={aId}
                    // checked={checked}
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