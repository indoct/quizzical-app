import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings: React.FC = () => {
  const [category, setCategory] = useState<string>("any");
  const [difficulty, setDifficulty] = useState<string>("any");
  const navigate = useNavigate();

  const handleStartQuiz = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault;
    navigate(`/quiz?category=${category}&difficulty=${difficulty}`);
  };

  return (
    <>
      <form id="setup">
        <div className="quiz-setup">
          <fieldset>
            <legend>Trivia Question Settings:</legend>
            <label htmlFor="category">
              Category:
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="any">Any Category</option>
                <option value="9">General Knowledge</option>
                <option value="10">Entertainment: Books</option>
                <option value="11">Entertainment: Film</option>
                <option value="12">Entertainment: Music</option>
                <option value="13">
                  Entertainment: Musicals &amp; Theatres
                </option>
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
                <option value="31">
                  Entertainment: Japanese Anime &amp; Manga
                </option>
                <option value="32">
                  Entertainment: Cartoon &amp; Animations
                </option>
              </select>
            </label>
            <label htmlFor="difficulty">
              Difficulty:
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                name="difficulty"
                id="difficulty"
              >
                <option value="any">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </fieldset>
        </div>
      </form>
      <button
        className="ui-btn"
        type="submit"
        form="setup"
        onClick={(e) => handleStartQuiz(e)}
      >
        Start Quiz
      </button>
    </>
  );
};

export default Settings;
