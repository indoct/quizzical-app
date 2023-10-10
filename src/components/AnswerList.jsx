import React from "react"

export default function AnswerList(props) {

    // const answerElements = props.answers.map(a => {
    // return (
    //     <li className="ans-option" key={a.key} selected={a.selected} onClick={()=>toggle(a.optId, a.selected)}>{a.option}</li>
    //     )
    // })

const answerElements = props.answers.map(a => {
    const opt = a.option;

    return (
            <label key={a.key} htmlFor={a.key}>
                <input 
                    type="radio"
                    name={props.qid}
                    id={a.key}
                    value={opt}
                    onChange={props.handleChange}
                /> {opt}
            </label>
    )
})

return (
    <>
    <form>
        <fieldset>
            
            {answerElements}
        </fieldset>
    </form>
    </>
    )
}