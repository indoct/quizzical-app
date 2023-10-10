import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import QuestionBlock from './components/QuestionBlock'
import Intro from './components/Intro'

function App() {
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [questions, setQuestions] = React.useState({});
  const [questionsArr, setQuestionsArr] = React.useState({});
  const [options, setOptions] = React.useState({});
  const [dataLoaded, setDataLoaded] = React.useState(false);
  const [answerLists, setAnswerLists] = React.useState({});
  
  React.useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=5')
          .then(res => res.json())
          .then(data => setQuestions(data.results.map(q => {
            const incArray = q.incorrect_answers;
            incArray.splice(((incArray.length+1) * Math.random()), 0, q.correct_answer);
            return {
                qId: nanoid(),
                question: he.decode(q.question),
                correct: he.decode(q.correct_answer),
                answers: incArray
            }
          })))
          .then(() => setDataLoaded(true))
  }, [])
  
  React.useEffect(() => {
  if(!dataLoaded) return;
  else { 
    setOptions(questions.map(question => {
        const qid = question.qId;

        return question.answers.map(ans => {
            const key = nanoid();
            return (
            {   option: he.decode(ans), 
                key: key, 
                optId: key,
                qId: qid,
                selected: false 
            });
        })
    }));

  }
  }, [dataLoaded])

React.useEffect(() => {
    if(options.length != 5) return;
    else {
            setQuestionsArr(() => {
                return questions.map((q,i) => {
                    return {
                        ...q,
                        answers: options[i]
                    }
                })
            })
    }
}, [options])

React.useEffect(() => {
    if(questionsArr.length != 5) return;
    else {
        // return function al() {
        //     return answerLists;
        // }
        setAnswerLists(questionsArr.map(question => {
            const ques = question.question;
            const name = question.qId;
    
            return question.answers.map(ans => {
                return (
                {   ques: ques,
                    [name]: ans.option
                });
            })
        }));
    }
}, [questionsArr])


function handleChange(event) {
    const {name, value, type, checked} = event.target

    setAnswerLists(prevAnsData => {
        setTimeout(() => { console.log(prevAnsData) }, 1000)
        return {
            ...prevAnsData,
            [name]: type === "checkbox" ? checked : value
        }
    })
}
  
function startQuiz() {
    setQuizStarted(true)
}

const handleSubmit = (e) => {
    e.preventDefault()
    console.log(answerLists)
}
  
  const questionElements = (questionsArr.length === undefined) ? '' : questionsArr.map(q => { 
          return (
            <article className="qna-container" key={q.qId}>
              <QuestionBlock 
                question={q.question}
                qid={q.qId}
                answers={q.answers}
                answerLists={answerLists}
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
