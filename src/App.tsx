import './App.css'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="ufo-container">
        <div className="ufo-matte glow"></div>
        <div className="ufo-glow"></div>
        <input type="text" placeholder="UFO" className='ufo-text' />
      </div>
    </div>
  )
}

export default App
