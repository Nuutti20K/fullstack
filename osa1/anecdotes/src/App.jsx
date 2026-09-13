import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(8).fill(0))
  const [highest, setHighest] = useState({index: 0, votes: 0})

  const randomNumber = () => Math.floor(Math.random() * 8)

  const handleRandom = () => {
    setSelected(randomNumber())
  }

  const handleVote = () => {
    console.log('voted')
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
    console.log(copy)
    if (copy[selected] > highest.votes) {
      const newHighest = {index: selected, votes: copy[selected]}
      setHighest(newHighest)
    }
  }


  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br/>
      has {votes[selected]} votes<br/>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleRandom}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {anecdotes[highest.index]}<br/>
      has {votes[highest.index]} votes<br/>
    </div>
  )
}

export default App