import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import QuestionBlock from './components/QuestionBlock'
import Intro from './components/Intro'

function App() {
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [questions, setQuestions] = React.useState({});

    function startQuiz() {
        setQuizStarted(true)
    }

  React.useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=5')
          .then(res => res.json())
          .then(data => setQuestions(data.results.map(q => {
            const incArray = q.incorrect_answers;
            incArray.splice(((incArray.length+1) * Math.random()), 0, q.correct_answer);
            const decodedArr = [];
            incArray.map(item => decodedArr.push(he.decode(item)))
            const decQ = he.decode(q.question)

            return {
                qId: nanoid(),
                question: decQ,
                correct: he.decode(q.correct_answer),
                answers: decodedArr,
                [decQ]: ""
            }
          })))
  }, [])

function handleChange(event) {
    const {name, value, type, checked} = event.target

//    const testObj = { [name]: type === "checkbox" ? checked : value } 
//    console.log(testObj)
//    return testObj

    setQuestions(questions.map(question => {
        console.log(questions[0])
        return {
            ...question,
            [name]: type === "checkbox" ? checked : value,
        }
    }))

}

const handleSubmit = (e) => {
    e.preventDefault()
}
  
  const questionElements = (questions.length === undefined) ? '' : questions.map((q,ind) => { 
        const qContent = q.question;

          return (
            <article className="qna-container" key={q.qId}>
              <QuestionBlock     
                question={q.question}
                qid={q.qId}
                qNum={ind}
                selected={q[qContent]}
                answers={q.answers}
                handleChange={handleChange}
              />
              </article>
          )
      })

  return (
      <main>
          {
          quizStarted ?
              <section className="quiz-container">
                <form onSubmit={handleSubmit}>
                    {questionElements}
                    <button disabled>Check Answers</button>
                </form>
                    
              </section>
              :
              <Intro startQuiz={startQuiz}/>
          }
      </main>
  )
}

export default App
