import React, { useState, useEffect } from 'react'
import './App.css'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)



  const getLocalItems = () => {
    let list = localStorage.getItem('savedNotes');


    if (list) {
      return JSON.parse(localStorage.getItem('savedNotes'));
    } else {
      return [];
    }
  }
  const [savedNotes, setSavedNotes] = useState(getLocalItems());
  useEffect(() => {
    handleListen()
    // eslint-disable-next-line
  }, [isListening])

  useEffect(() => {
    localStorage.setItem('savedNotes', JSON.stringify(savedNotes))
  }, [savedNotes]);

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }



  return (
    <>
      <h1>VText</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <div className="eachItem">
            <h2>Notes</h2>
            {savedNotes.map(n => (
              <p key={n}>{n}</p>
            ))}

          </div>

        </div>
      </div>
    </>
  )
}

export default App