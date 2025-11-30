import { useState } from 'react'
import './App.css'

function App() {
  const [value, setValue] = useState('');

  const doneThinking = () => {
    setValue('This is my answer')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      <button onClick={doneThinking}>Done</button>
      <div className="ufo-container">
        {!value && <div className="ufo-matte glow"></div>}
        <input value={value} type="text" placeholder='Generating...' className={[value ? '' : 'thinking', 'ufo-text'].join(' ')} />
      </div>

      {/* <div className="ufo-container">
        <div className="ufo-matte glow"></div>
        <div className="ufo-glow"></div>
        <input value={value} type="text" className='ufo-text' />
      </div> */}
    </div>
  )
}

export default App
