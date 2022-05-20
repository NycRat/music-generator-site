import { useEffect, useState } from "react";
import * as Tone from "tone";

interface NoteInfo {
  name: string;
  start: number;
  end: number;
}

const App = () => {
  const synth = new Tone.Synth().toDestination();
  const drumSynth = new Tone.Synth().toDestination();

  const [numNotes, setNumNotes] = useState(12);
  const [bpm, setBpm] = useState(80);

  const getRandomNote = () => {
    return String.fromCharCode(
      "a".charCodeAt(0) + Math.floor(Math.random() * 7) // A-G
    );
  };

  const generateMusic = () => {
    let newNotes: Array<NoteInfo> = [];

    let speed = 4;

    for (let i = 0; i < numNotes; i++) {
      newNotes.push({
        name: getRandomNote() + "4",
        start: (i * 60) / (bpm * speed),
        end: (i * 60) / (bpm * speed) + 1 / speed,
      });
    }

    console.log("woa");

    return newNotes;
  };

  const playMusic = (notes: Array<NoteInfo>) => {
    const now = Tone.now();
    for (let note of notes) {
      synth.triggerAttack(note.name, now + note.start);
      synth.triggerRelease(now + note.end);
    }
    let endTime = notes[notes.length - 1].end;
    for (let i = 0; i < (bpm / 60) * endTime; i++) {
      let drumPos = now + i / (bpm / 60); // the position in time where the drum should be
      drumSynth.triggerAttack("a3", drumPos, 0.6);
      drumSynth.triggerRelease(drumPos + 1 / (bpm / 60) / 2);
    }
  };

  return (
    <div className="app">
      <div className="settings">
        <div className="setting-option">
          <span>BPM: {bpm}</span>
          <button onClick={() => setBpm(bpm + 5)}>-</button>
          <button onClick={() => setBpm(bpm - 5 > 0 ? bpm - 5 : bpm)}>+</button>
        </div>

        <div className="setting-option">
          <span># of Notes: {numNotes}</span>
          <button onClick={() => setNumNotes(numNotes + 1)}>+</button>
          <button
            onClick={() =>
              setNumNotes(numNotes - 1 > 0 ? numNotes - 1 : numNotes)
            }
          >
            -
          </button>
        </div>
      </div>

      <button
        className="large-button"
        onClick={async () => {
          await Tone.start();
          playMusic(generateMusic());
        }}
      >
        Play
      </button>
    </div>
  );
};

export default App;
