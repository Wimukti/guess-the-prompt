import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Game.css";
import questionImage from "./question.png";

const Game = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [guess, setGuess] = useState("");
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState(0);
  const [guessedImage, setGuessedImage] = useState(questionImage);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const handleSeeHintClick = () => {
    setShowHints(!showHints);
  };

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await fetch(
          "https://dkta9n.buildship.run/get-original"
        );
        const data = await response.json();
        setCollection(data);
      } catch (error) {
        console.error("Error fetching collection:", error);
      }
    };

    fetchCollection();
  }, []);

  const handleSubmit = async () => {
    setDisabled(true);
    setIsLoading(true);
    if (collection.length > 0 && guess.trim() !== "") {
      setIsRevealed(true);
      try {
        const response = await fetch("https://dkta9n.buildship.run/get-score", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalPrompt: collection[count].prompt,
            guessedPrompt: guess,
          }),
        });

        const data = await response.json();
        setGuessedImage(data.generatedImage);
        setScore(Math.round(data.score * 100));
      } catch (error) {
        console.error("Error submitting guess:", error);
      }
    }
    setIsLoading(false);
    setDisabled(false);
  };

  const handleGuessChange = (event) => setGuess(event.target.value);

  const handleNextImage = () => {
    setShowHints(false);
    setIsRevealed(false);
    setGuess("");
    setGuessedImage(questionImage);
    setCount((prevCount) => (prevCount + 1) % collection.length);
  };

  return (
    <div className="game-wrapper">
      <h1 className="game-title">Guess the prompt</h1>
      <div className="game">
        <div className="card-container">
          {isLoading ? (
            <div className="card-spinner">
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            </div>
          ) : (
            <Card
              image={guessedImage}
              title="Submit a Guess!"
              isRevealed={isRevealed}
            />
          )}
          <div className="card">
            <div className="hints-container">
              <div className="hints">
                Hint:
                <span className={`${showHints ? "" : "blurred"}`}>
                  {collection.length > 0
                    ? collection[count].hints.join(", ")
                    : ""}
                </span>
              </div>
              <div className="length">
                Length:
                <span className={`${showHints ? "" : "blurred"}`}>
                  {collection.length > 0 ? collection[count].length : ""}{" "}
                  words
                </span>
              </div>
            </div>

            {score !== null && (
              <h3 className="score">Similarity Score: {score}%</h3>
            )}
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter your guess here!"
                value={guess}
                onChange={handleGuessChange}
              />
              <div className="buttons-container">
                <button onClick={handleSeeHintClick} className="hint-button">
                  See Hint
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={disabled}
                  className="submit-button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-container">
          {collection.length > 0 && (
            <Card
              image={collection[count].imageUrl}
              title="Given Image"
              isRevealed={true}
            />
          )}
          <div className="input-container">
            <button onClick={handleNextImage} className="next-button">
              Next Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
