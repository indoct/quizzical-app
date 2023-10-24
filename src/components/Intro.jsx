import React from "react"

export default function Intro(props) {

    return (
        <section>
            <h1>Quizzical</h1>
            <h2>Let's get quizzical</h2>
            <form id="setup">
                <div className="quiz-setup">
                    <label htmlFor="category">Select Category: </label>
                    <br /><select id="category" name="category" onChange={props.handleSettingsChange}>
                        <option value="any">Any Category</option>
                        <option value="9">General Knowledge</option>
                        <option value="10">Entertainment: Books</option>
                        <option value="11">Entertainment: Film</option>
                        <option value="12">Entertainment: Music</option>
                        <option value="13">Entertainment: Musicals &amp; Theatres</option>
                        <option value="14">Entertainment: Television</option>
                        <option value="15">Entertainment: Video Games</option>
                        <option value="16">Entertainment: Board Games</option>
                        <option value="17">Science &amp; Nature</option>
                        <option value="18">Science: Computers</option>
                        <option value="19">Science: Mathematics</option>
                        <option value="20">Mythology</option>
                        <option value="21">Sports</option>
                        <option value="22">Geography</option>
                        <option value="23">History</option>
                        <option value="24">Politics</option>
                        <option value="25">Art</option>
                        <option value="26">Celebrities</option>
                        <option value="27">Animals</option>
                        <option value="28">Vehicles</option>
                        <option value="29">Entertainment: Comics</option>
                        <option value="30">Science: Gadgets</option>
                        <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
                        <option value="32">Entertainment: Cartoon &amp; Animations</option>
                    </select>
                </div>
                <div className="quiz-setup">
                    <label htmlFor="difficulty">Select Difficulty: </label>
                    <br /><select name="difficulty" id="difficulty" onChange={props.handleSettingsChange}>
                        <option value="any">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
		            </select>
                </div>
                {/* <div className="quiz-setup">
                    <label htmlFor="amount">Number of Questions:</label>
                    <br /><input type="number" name="amount" id="amount" min="5" max="50" value={props.amount} onChange={props.handleSettingsChange} disabled={props.cat || props.diff} />
                </div> */}
            </form>
            <button onClick={props.handleStart}>Start Quiz</button>
        </section>
    )
}