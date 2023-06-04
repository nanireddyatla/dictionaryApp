import React, { useState } from "react";

import audio from "./audio.png";

import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [meta, setMeta] = useState({});
  const [definition, setDefinition] = useState({});
  const [wordbook, setWordbook] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const iconClick = () => {
    setIsPlaying(!isPlaying);
  };

  const search = async (e) => {
    if (e.key === "Enter") {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setMeta(data[0]);
          console.log(data[0]);
        });

      fetch(`https://api.api-ninjas.com/v1/dictionary?word=${query}`, {
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const points = {
            definition: data.definition.split(/\d+\.\s+/).filter(Boolean),
            word: data.word,
            valid: data.valid,
          };
          console.log(points);
          setDefinition(points);
        });

      fetch(`https://api.api-ninjas.com/v1/thesaurus?word=${query}`, {
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setWordbook(data);
        });

      setQuery("");
    }
  };

  const defItems = (points, n) => {
    return points.slice(0, n).map((item, index) => <li>{item}</li>);
  };
  const ddItems = (points, n) => {
    return points.slice(0, n).map((item, index) => <dd>{item}</dd>);
  };

  return (
    <div className="main-container">
      <input
        type="text"
        className="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={search}
      />
      {definition.valid && (
        <div className="result">
          <div className="head">
            <h2 className="word-name">
              <span>{definition.word}</span>
              <sup>
                {isPlaying && (
                  <audio
                    src={meta.phonetics[0].audio}
                    className="phonetics-audio"
                    autoPlay={true}
                  />
                )}
                <img src={audio} alt=" " onClick={iconClick} />
              </sup>
            </h2>
          </div>
          <h4 className="phonetic-text">{meta.phonetics[0].text}</h4>
          <div className="info">
            <ol>{defItems(definition.definition, 3)}</ol>
            <div className="words">
              <div>
                <dt>Synonyms</dt>
                <div className="list">{ddItems(wordbook.synonyms, 7)}</div>
              </div>
              <div>
                <dt>Antonyms</dt>
                <div className="list">{ddItems(wordbook.antonyms, 7)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
