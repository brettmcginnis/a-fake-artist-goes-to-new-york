import { useState } from 'react'
import './App.css'
import Canvas from './Canvas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <Canvas />
      </header>
    </div>
  )
}

export default App
