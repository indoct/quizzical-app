import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import QuestionBlock from './components/QuestionBlock'
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
            const decQ = he.decode(q.question);
            const qName = ind === 0 ? `question01` : `question0${ind+1}`

            return {
                qId: qName,
                question: decQ,
                correct: he.decode(q.correct_answer),
                answers: decodedArr,
                [qName]: ""
            }
          })))
  }, [])

function startQuiz() {
    setQuizStarted(true)
}

function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setQuestions(questions.map(question => {
        return {
            ...question,
            [name]: type === "checkbox" ? checked : value
        }
    }))

}

const handleSubmit = (e) => {
    e.preventDefault()
    console.log(questions)
}
  
  const questionElements = (questions.length === undefined) ? '' : questions.map((q,ind) => { 
    // const propName = Object.getOwnPropertyNames(q)[4];
    // const qName = ind === 0 ? `question01` : `question0${ind+1}`
    // console.log(q.qName)
    // console.log(q[`'propName'`])
    // const currentQ = q;
    // console.log(currentQ)
    // const testObj = Object.values(q)[0];

          return (
            <article className="qna-container" key={nanoid()}>
              <QuestionBlock     
                question={q.question}
                // selected={testObj}
                qid={q.qId}
                qNum={ind}
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
