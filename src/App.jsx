import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import QABlock from './components/QABlock'
import Intro from './components/Intro'

function App() {
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [quizArray, setQuizArray] = React.useState({});

    const shuffle = (array) => {
      for (let i = array.length - 1; i >= 0; i--) {
             const randomIndex = Math.floor(Math.random() * (i + 1));
             array.push(array[randomIndex]);
             array.splice(randomIndex, 1);
         }
         return array;
    }

  React.useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=5')
          .then(res => res.json())
          .then(data => {
            setQuizArray(data.results.map(q => {
            const correctAns = he.decode(q.correct_answer)
            const decodedInc = q.incorrect_answers.map(a => he.decode(a));
            const allOptions = [correctAns, ...decodedInc]

            return {
                id:nanoid(),
                question: he.decode(q.question),
                correct: correctAns,
                incorrect: decodedInc,
                options: shuffle(allOptions),
                selected: ""
            }
          }));
        })
  }, [])

function startQuiz() {
  setQuizStarted(true);
}

function handleChange(event) {
  const { value, dataset } = event.target;

  for(const quizItem of quizArray) {
    const optArray = quizItem.options;
    if(quizItem.id === dataset.id) {
      for(const optItem of optArray) {
        const qid = quizItem.id;
        if(value === optItem) selectOption(value, qid)
      }
    }
  }
}

function selectOption(val, qid) {
    setQuizArray(prevQuestions => prevQuestions.map(question => {
    return question.id===qid ? {...question,  selected:val} : question
    })) 
}

const qaElements = quizArray.length !== 5 ? '' : quizArray.map((q,i) => {
  return(
  <QABlock 
    key={q.id}
    qid={q.id}
    qnum={`0${i+1}`}
    selected={q.selected}
    question={q.question}
    options={q.options}
    handleChange={handleChange}
     />
  )
});

const checkAnswers = () => {
const answers = quizArray.filter(ans => ans.correct === ans.selected)
console.log(answers)
}

const handleSubmit = (e) => {
    e.preventDefault()
    checkAnswers()
}

  return (
      <main>
          {
          quizStarted ?
              <section className="quiz-container">  
                <form onSubmit={handleSubmit}>
                    {qaElements}
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
