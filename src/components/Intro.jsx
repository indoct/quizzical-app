import React from "react"

export default function Intro(props) {
    const [value,onChange]=React.useState(1);
    
    return (
        <section className="intro">
            <h1>Quizzical</h1>
            <h2>Let's get quizzical</h2>
            <form id="setup">
                    <label for="amount-select">Number of questions:</label>
                        <input type="range" min="5" max="50" name="amount" id="amount-select" step="1" value={value}
                        onChange={({ target: { value: radius } }) => { onChange(radius);}}
                        />
                            <span>{value}</span>
            </form>
            <button onClick={props.startQuiz}>Start Quiz</button>
        </section>
    )
}