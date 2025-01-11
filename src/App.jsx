//CSS
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

//data
import { wordsList } from './data/words'

//component
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

{/*Define os estagios go game*/}
const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

function App() {
  {/*Define como estagio inicial a pagina start e pega as palavras da wordlist*/}
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  {/*Pega a palavra, a categoria e as letras da palavra escolhida*/}
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(5)
  const [score, setScore] = useState(0)

  {/*Pega a palavra com a categoria especifica*/}
  const pickWordAndCategory = useCallback(() => {

    {/*Define um array de categorias*/}
    const categories = Object.keys(words);

    {/*Define uma categoria*/}
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    {/*Define uma palavra dentro da categoria*/}
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    {/*Retorna os dois*/}
    return{word, category};
  }, [words])


  const startGame = useCallback(() => {

    clearLetterStates();
    {/*Pega a palavra e a categoria da função*/}
    const { word, category } = pickWordAndCategory();
    console.log(word)
    console.log(category)

    {/*Separa cada letra da palavra, criando um array*/}
    let wordLetters = word.split("")
     {/*Coloca tudo em minusculo*/}
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    console.log(wordLetters)

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    setGameStage (stages[1].name)
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
    setGuesses(5)
  };

  useEffect(() => {
    if(guesses <= 0) {
      clearLetterStates();
      setGameStage(stages[2].name)
    }

  }, [guesses])

  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    if(guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore + 100))

      startGame();
    }

  }, [guessedLetters, letters, startGame])

  console.log(guessedLetters)
  console.log(wrongLetters)

  const retry = () => {
    setGameStage (stages[0].name)
    setScore(0)
    setGuesses(5)

  }

  return (
    <>
      <div className='App'>
        {gameStage === 'start' && <StartScreen startGame={startGame}/>}
        {gameStage === 'game' && 
        <Game 
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord} 
        pickedCategory={pickedCategory} 
        letters={letters} 
        guessedLetters={guessedLetters} 
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        />}
        {gameStage === 'end' && <GameOver retry={retry} score={score}/>}

      </div>
    </>
  )
}

export default App
