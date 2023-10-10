import React from "react"

export default function QuestionBlock(props) {

// const answerElements = props.answers.map(a => {
// return (
//     <li className="ans-option" key={a.key} selected={a.selected} onClick={()=>toggle(a.optId, a.selected)}>{a.option}</li>
//     )
// })

const answerElements = props.answers.map(a => {
    const opt = a.option;
    const qid = props.qid;

    return (
            <label key={a.key} htmlFor={a.key}>
                <input 
                    type="radio"
                    name={qid}
                    id={a.key}
                    value={opt}
                    
                    onChange={props.handleChange}
                /> {opt}
            </label>
    )
})

return (
    <>
        <fieldset>
            <legend>{props.question}</legend>
            {answerElements}
        </fieldset>
    </>
    )
}