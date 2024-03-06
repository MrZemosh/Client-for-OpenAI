import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import LoginScreen from './LoginScreen';
import { Text, TextRaw } from './components/Text';

// Definice API klíče
const API_KEY = "";

const App = () => {

  // Stavové proměnné pro uchování údajů o uživateli, vstupu, dokončené větě a historii chatu
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false)

  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>(
    () => {
      // Načtení historie chatu z lokálního úložiště, pokud existuje
      const savedChatHistory = localStorage.getItem('chatHistory');
      return savedChatHistory ? JSON.parse(savedChatHistory) : [];
    }
  );
  // Reference k chatovacímu kontejneru pro automatický posun dolů
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Uložení historie chatu do lokálního úložiště
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    // Posunutí scrollu na konec chatu
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Funkce pro získání odpovědi od Open AI
  const fetchData = async (input: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant and you are speaking only czech"
            },
            {
              role: "user",
              content: `My name is ${localStorage.getItem('userName')} and this is what I want: ${input}`
            }
          ],
          model: 'gpt-3.5-turbo',
          max_tokens: 1000,
          n: 1,
          stop: "."
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      setLoading(false);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      setLoading(false);
      throw error;
    }
  };

  // Funkce pro zpracování kliknutí na tlačítko "Odeslat"
  const handleClick = async () => {
    try {
      const response = await fetchData(input);

      // Aktualizace historie chatu s novým vstupem a odpovědí
      const newChatHistory = [
        ...chatHistory, 
        { 
          role: 'user', 
          content: input 
        }, 
        { 
          role: 'ai', 
          content: response 
        }
      ];
      setChatHistory(newChatHistory);
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };

  // Funkce pro smazání historie chatu
  const handleClearHistory = () => {
    setChatHistory([]);
  };

  return (
    <div className="app">
      {userName.length === 0 ? (
        // Pokud uživatel není přihlášen, zobrazí se komponenta pro přihlášení
        <LoginScreen setUserName={setUserName} />
      ) : (
        <div className="container">
          <div className='row'>
            <img src="/nlogo.png" alt="Můj obrázek" height="35" />
            
            <button onClick={() => {
              localStorage.setItem("lang", !localStorage.getItem("lang") ? "en" : localStorage.getItem("lang") === "cs" ? "en" : "cs")
              window.location.reload()
            }}>
              { !localStorage.getItem("lang") ? "Angličtina" : localStorage.getItem("lang") === "cs" ? "Angličtina" : "Czech" }
            </button>
          </div>
          
          <div className='chat' ref={chatContainerRef}>
            {chatHistory.map((message, index) => (
              // Zobrazení historie chatu
              <div key={index} className={`message ${message.role}`}>
                <span>
                  <b>{message.role === 'user' ? userName : 'Zemosh AI'}: </b> 
                </span>
                {message.content}
              </div>
            ))}
          </div>

          <div className="message-form">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={TextRaw("MESSAGE_PLACEHOLDER")}
            />

            <button className="button remove" onClick={ handleClearHistory }>
              <Text>CLEAR_HISTORY</Text>
            </button>
            <button className={`button space ${loading && "btn-loading"}`} onClick={ handleClick }>
              {
                loading ?
                  <div className="bouncing-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div> 
                : 
                  <Text>SEND</Text>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
