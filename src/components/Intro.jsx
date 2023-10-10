import React from "react"

export default function Intro(props) {
    return (
        <section className="intro">
            <h1>Quizzical</h1>
            <h2>Let's get quizzical</h2>
            <button onClick={props.startQuiz}>Start Quiz</button>
        </section>
    )
}