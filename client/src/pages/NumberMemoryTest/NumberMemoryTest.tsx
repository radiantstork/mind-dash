import { useEffect, useState } from "react";

const NumberMemoryTest: React.FC = () => {
    const [level, setLevel] = useState(3);
    const [lives, setLives] = useState(3);
    const [number, setNumber] = useState("");
    const [showNumber, setShowNumber] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [status, setStatus] = useState<"idle" | "playing" | "over">("idle");

    const generateRandNum = (length: number): string => {
        let result = "";
        for (let i = 0; i < length; ++i) {
            result += String.fromCharCode(48 + Math.floor(Math.random() * 10));
        }
        return result;
    };

    const startLevel = () => {
        const newNum = generateRandNum(level);
        setNumber(newNum);
        setShowNumber(true);
        setUserInput("");
        setStatus("playing");

        setTimeout(() => {
            setShowNumber(false);
        }, level * 1000);
    };

    const handleSubmit = () => {
        if (userInput === number) {
        setLevel(prev => prev + 1);
        } else {
            if (lives > 1) {
                setLives(prev => prev - 1);

                const newNum = generateRandNum(level);
                setNumber(newNum);
                setUserInput("");
                setShowNumber(true);

                setTimeout(() => {
                    setShowNumber(false);
                    setStatus("playing");
                }, level * 1000);
            } else {
                setStatus("over");
            }
        }
    };

    const startGame = () => {
        setLevel(3);
        setLives(3);
        setStatus("playing");
        startLevel();
    };

    useEffect(() => {
        if (status === "playing") {
        startLevel();
        }
    }, [level]);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h1>Number Memory Test</h1>
    
          {status === "idle" && (
            <>
              <button onClick={startGame}>Start Game</button>
            </>
          )}
    
          {status === "over" && (
            <>
              <p>You reached level {level}</p>
              <button onClick={startGame}>Start Game</button>
            </>
          )}
    
          {status === "playing" && (
            <>
              <h2>Level {level}</h2>
              <h3>Lives: {lives}</h3>
    
              {showNumber ? (
                <h1 style={{ fontSize: "3rem" }}>{number}</h1>
              ) : (
                <div>
                  <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder="Enter the number"
                  />
                  <button onClick={handleSubmit}>Submit</button>
                </div>
              )}
            </>
          )}
        </div>
      );
};

export default NumberMemoryTest;
