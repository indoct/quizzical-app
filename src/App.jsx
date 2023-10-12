import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import AnswerList from './components/AnswerList'
import Intro from './components/Intro'

function App() {
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [questions, setQuestions] = React.useState({});

  React.useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=5')
          .then(res => res.json())
          .then(data => setQuestions(data.results.map((q,ind) => {
            const incArray = q.incorrect_answers;
            incArray.splice(((incArray.length+1) * Math.random()), 0, q.correct_answer);
            const decodedArr = [];
            incArray.map(item => decodedArr.push(he.decode(item)))

            return {
                qId: ind === 0 ? `question01` : `question0${ind+1}`,
                question: he.decode(q.question),
                correct: he.decode(q.correct_answer),
                answers: decodedArr,
                selected: ""
            }
          })))
  }, [])

function startQuiz() {
    setQuizStarted(true)
}

function handleChange(event) {
    const { name, value } = event.target;

  //   let prior = form.querySelector('label.checked input[name="' + target.name + '"]');
  //   if (prior) {
  //     prior.parentElement.classList.remove("checked");
  //   }
  //   targetParent.classList.add("checked");

    setQuestions(questions.map(question => {
      if(name === question.qId) {
          return {
              ...question,
              selected: value
          }
        } else {
          return question;
        }
    }))

}

const checkAnswers = () => {
  questions.forEach(ans => {
    console.log(ans.selected, ans.correct)
  })
}

const handleSubmit = (e) => {
    e.preventDefault()
    console.log(questions)
    checkAnswers()
}

const styles = {

}
  

  const QuestionEl=()=>{
      return questions.map((q,qi) => {
        const qNum = qi;
          return(
            <React.Fragment key={q.qId}>
              <fieldset key={q.qId}>
                <legend>{q.question}</legend>
                {q.answers.map((a,i) => {
                  const aId = `Q${qNum+1}0${i+1}-${a}`
                  return (
                    <div className="option-cont" key={nanoid()}>
                      <input 
                          type="radio"
                          name={q.qId}
                          id={aId}
                          value={a}
                          checked={questions[qNum].selected === a}
                          onChange={handleChange}
                      /> 
                      <label htmlFor={aId} className="option-label" style={styles}>{a}</label>
                    </div>
                  )
                })}
              </fieldset>
            </React.Fragment>
          )
      })
  }

  return (
      <main>
          {
          quizStarted ?
              <section className="quiz-container">
                
                <form onSubmit={handleSubmit}>
                    {questions.length !== undefined && <QuestionEl />}
                    
                    <button>Check Answers</button>
                </form>
                    
              </section>
              :
              <Intro startQuiz={startQuiz}/>
          }
      </main>
  )
}

export default App
