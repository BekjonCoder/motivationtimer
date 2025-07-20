import React, { useState, useEffect, useRef } from "react";
const App: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [quote, setQuote] = useState<string>("Qani, kettik boshladik! 🚀💪");
  const [showSalute, setShowSalute] = useState<boolean>(false);
  const [dailyTime, setDailyTime] = useState<number>(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const clapRef = useRef<HTMLAudioElement | null>(null);

  const quotes: string[] = [
    "Keep going, you’re doing great! 🌟",
    "Don’t watch the clock; do what it does. Keep going. ⏰💡",
    "Your limitation—it’s only your imagination. 💭🔥",
    "Push yourself, because no one else is going to do it for you. 💪✨",
    "Great things never come from comfort zones. 🚀",
  ];

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const savedStats = JSON.parse(localStorage.getItem("focusStats") || "{}");
    setDailyTime(savedStats[today] || 0);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prev) => {
          const updated = prev + 1;

          const today = new Date().toLocaleDateString();
          const savedStats = JSON.parse(localStorage.getItem("focusStats") || "{}");
          savedStats[today] = (savedStats[today] || 0) + 1;
          localStorage.setItem("focusStats", JSON.stringify(savedStats));
          setDailyTime(savedStats[today]);

          if (updated % 10 === 0) {
            const random = quotes[Math.floor(Math.random() * quotes.length)];
            setQuote(random);
          }

          if (updated >= 7200) {
            setIsActive(false);
            setShowSalute(true);
            setQuote("🎆 If you continue at this pace, you will surely find your place in the future without difficulty! ⭐💼");
            clapRef.current?.play();
          }

          return updated;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleMusic = (): void => {
    if (isMusicPlaying) {
      musicRef.current?.pause();
    } else {
      musicRef.current?.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const toggleTimer = (): void => {
    if (!isActive && time === 0) {
      setQuote("Come on, let's get started! 🚀💪");
    }
    setIsActive(!isActive);
  };

  const resetTimer = (): void => {
    setTime(0);
    setIsActive(false);
    setShowSalute(false);
    setQuote("Come on, let's get started! 🚀💪");
  };

  return (
    <div className="container">
      <h1>Focus Timer 🕒</h1>
      <h2>{time}s</h2>

      <div className="buttons">
        <button onClick={toggleTimer}>{isActive ? "⏸️ Pause" : "▶️ Start"}</button>
        <button onClick={resetTimer}>🔄 Reset</button>
        <button onClick={toggleMusic}>{isMusicPlaying ? "🔇 Stop Music" : "🎵 Play Music"}</button>
      </div>

      <p className="daily">📊Today you spent {dailyTime} seconds on the lesson!</p>
      <p className="quote">{quote}</p>

      {showSalute && (
        <div className="salute">
          🎆🎇🎆🎇
        </div>
      )}

      <audio ref={musicRef} src="/music.mp3" loop />
      <audio ref={clapRef} src="/clap.mp3" />
    </div>
  );
};

export default App;
