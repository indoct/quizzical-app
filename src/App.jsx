import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import QuestionBlock from './components/QuestionBlock'
import Intro from './components/Intro'

function App() {
    // const [test, setTest] = React.useState(false)
    // const depArr = []
    
    // setTimeout(() => { depArr.push(1,2,3,4) })
    
    // React.useEffect(() => {
        //     setTest(prevTest => !prevTest)
        // }, [depArr])
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [questions, setQuestions] = React.useState({});
    const [questionsArr, setQuestionsArr] = React.useState({});
    const [options, setOptions] = React.useState({});
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [answerLists, setAnswerLists] = React.useState({});

    function startQuiz() {
        setQuizStarted(true)
    }

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

// React.useEffect(() => {
//     if(questionsArr.length != 5) return;
//     else {
//         setAnswerLists(questionsArr.map(question => {
//             return question
//         }))
//         // return function al() {
//         //     return answerLists;
//         // }
//         // setAnswerLists(questionsArr.map(question => {
//         //     const name = question.qId;
    
//         //     return question.answers.map(ans => {
//         //         return (
//         //         {
//         //             selected: ""
//         //         });
//         //     })
//         // }));
//     }
// }, [questionsArr])


function handleChange(event) {
    const {name, value, type, checked} = event.target

    setAnswerLists(prevAnsData => {
        return {
            ...prevAnsData,
            [name]: type === "checkbox" ? checked : value
        }
    })

}

function checkAnswers() {
    console.log('test')
    // const ansName = "";
    // questionsArr.forEach(q => { 
    //     if(q.qId === name) {
    //         if(value === q.correct) { console.log(`correct answer selected: ${value}`)}
    //     }
    // })
}

const handleSubmit = (e) => {
    e.preventDefault()
    checkAnswers()
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
                    <button disabled={Object.keys(answerLists).length != 5}>Check Answers</button>
                </form>
                    
              </section>
              :
              <Intro startQuiz={startQuiz}/>
          }
      </main>
  )
}

export default App
