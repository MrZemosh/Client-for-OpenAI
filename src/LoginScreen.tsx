import React, { useState } from "react";
import { Text, TextRaw } from "./components/Text";

type LoginScreenProps = {
  setUserName: (name: string) => void
}

const LoginScreen = ({ setUserName }: LoginScreenProps) => {
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim() !== '') {
      localStorage.setItem('userName', name);
      setUserName(name);
    }
  };

  return (
    <div className="login-screen">
      <img className="logo" src="/logo.png" alt="Můj obrázek" />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={TextRaw("YOUR_NAME")}
      />
      <button onClick={handleLogin}><Text>CONTINUE</Text></button>
    </div>
  );
};

export default LoginScreen;