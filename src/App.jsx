import React from 'react'
import { nanoid } from 'nanoid'
import he from 'he'
import './App.css'
import QABlock from './components/QABlock'
import Intro from './components/Intro'

function App() {
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [quizArray, setQuizArray] = React.useState([]);
    const [quizState, setQuizState] = React.useState({ selected_count: false, game_over: false, data_loaded: false });

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
            if(!quizStarted) {
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
            }
        })
        .then(() => setQuizState(prevDataState => ({
          ...prevDataState,
          data_loaded: true
          })
        ))
  }, [quizStarted])

function startQuiz() {
  if(quizState.data_loaded) {
  setQuizStarted(prevState => !prevState);
  } else {
    setTimeout(() => {setQuizStarted(prevState => !prevState)}, 100)
  }
}

function handleChange(event) {
  const { value, dataset } = event.target;
  if(!quizState.game_over) {
    setQuizState(prevState => {
      const newCount = quizArray.filter(x => x.selected.length > 0).length + 1
      return newCount === 5 ? { ...prevState, selected_count: !prevState.selected_count } : prevState
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

const qaElements = quizArray.length !== 5 ? '' : quizArray.map((q,i) => {
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

const checkAnswers = () => {
const answers = quizArray.filter(ans => ans.correct === ans.selected);
return `You scored ${answers.length}/${quizArray.length} correct answers.`
}

const handleCheckBtn = () => {
      setQuizState(prevState => ({
        ...prevState,
        game_over: !prevState.game_over
      }))
      checkAnswers()
    }

const handleReplayBtn = (e) => {
      setQuizState(prevState => ({
        selected_count: !prevState.selected_count,
        game_over: !prevState.game_over
      }))
      setQuizStarted(false);

    }

  return (
      <main>
          {
          quizStarted ?
              <>
                <form>
                    {qaElements}
                </form>
                <div className="btn-container">
                  {quizState.game_over ?
                  <>
                    <p className="answer-text">{checkAnswers()}</p>
                    <button onClick={handleReplayBtn}>Play Again</button> 
                  </> :
                    <button onClick={handleCheckBtn} disabled={!quizState.selected_count || quizState.game_over } id="check-answer">Check Answers</button>
                  }
                </div>
              </>
              :
              <Intro startQuiz={startQuiz}/>
          }
      </main>
  )
}

export default App
