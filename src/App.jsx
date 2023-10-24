import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import Confetti from "react-confetti"
import './App.css'
import QABlock from './components/QABlock'
import Intro from './components/Intro'

function App() {
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [quizArray, setQuizArray] = React.useState([]);
    const [quizState, setQuizState] = React.useState({ selected_count: false, game_over: false });
    const [quizSettings, setQuizSettings] = React.useState({ difficulty: '', category: '' })

  const shuffle = (array) => {
      for (let i = array.length - 1; i >= 0; i--) {
             const randomIndex = Math.floor(Math.random() * (i + 1));
             array.push(array[randomIndex]);
             array.splice(randomIndex, 1);
         }
         return array;
    }

  const generateAPIConfig = () => {
      const { difficulty, category } = quizSettings;
      let configString = `https://opentdb.com/api.php?amount=5`
      return    category && difficulty ? configString  + `&category=${category}&difficulty=${difficulty}`
              : !difficulty && category ? configString + `&category=${category}`
              : !category && difficulty ? configString + `&difficulty=${difficulty}`
              : configString
    }
  
  function fetchData() {
  const apiUrl = generateAPIConfig();
      fetch(`${apiUrl}`)
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
    .then(() => {
      if(!quizStarted) setQuizStarted(prevState => !prevState)
    })
}

function handleSettingsChange(event) {
  const { name, value } = event.target;
  setQuizSettings(prevSettings => {
    return name === 'difficulty' && value !== 'any' ? { ...prevSettings, difficulty: value }
         : name === 'difficulty' && value === 'any' ? { ...prevSettings, difficulty: '' }
         : name === 'category' && value !== 'any' ? { ...prevSettings, category: value }
         : name === 'category' && value === 'any' ? { ...prevSettings, category: '' }
         : prevSettings
  })
}

function handleChange(event) {
  const { value, dataset } = event.target;
  if(!quizState.game_over) {
    setQuizState(prevState => {
      const newCount = quizArray.filter(x => x.selected.length > 0).length + 1
      return newCount === quizArray.length ? { ...prevState, selected_count: !prevState.selected_count } : prevState
  })

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
}

const qaElements = quizArray.map((q,i) => {
  return(
  <QABlock 
    key={q.id}
    qid={q.id}
    qnum={`${i+1}`}
    selected={q.selected}
    question={q.question}
    options={q.options}
    correct={q.correct}
    handleChange={handleChange}
    quizState={quizState}
     />
  )
});

function checkAnswers() {
const correctAnswers = quizArray.filter(ans => ans.correct === ans.selected).length;
return correctAnswers;
}

const handleCheckBtn = () => {
      setQuizState(prevState => ({
        ...prevState,
        game_over: !prevState.game_over
      }))
      setQuizSettings(prevSettings => {
        return { ...prevSettings, difficulty: '', category: '' }
      })
      checkAnswers()
    }

const handleReplayBtn = () => {
      setQuizState(prevState => ({
        selected_count: !prevState.selected_count,
        game_over: !prevState.game_over
      }))
      // setQuizArray(() => {
      //  return []
      // })
      fetchData()
      setQuizStarted(prevState => !prevState);
    }

  return (
    <>
          {
          quizStarted ?
              <section>
              {quizState.game_over && (checkAnswers() === quizArray.length) && <Confetti />}
                <form id="quiz-body">
                    {qaElements}
                </form>
                <div className="btn-container">
                  {quizState.game_over ?
                  <>
                    <p className="answer-text">You scored {checkAnswers()}/{quizArray.length} correct answers.</p>
                    <button onClick={handleReplayBtn}>Play Again</button> 
                  </> :
                  <>
                    <p className="answer-text">{!quizState.selected_count ? 'Please select an answer for every question' : 'Good to go!'}</p>
                    <button onClick={handleCheckBtn} disabled={!quizState.selected_count || quizState.game_over } id="check-answer">Check Answers</button>
                  </>
                  }
                </div>
              </section>
              :
              <Intro 
                handleSettingsChange={handleSettingsChange}
                handleStart={fetchData}
                />
          }
      <footer>Developed with ❤ by <strong><a href="https://scho.pro" target="_blank">scho.</a></strong></footer>
      </>
  )
}

export default App
