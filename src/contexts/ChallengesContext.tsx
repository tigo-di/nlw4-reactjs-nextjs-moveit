import { createContext, useState, ReactNode, useEffect } from "react";
import challenges from "../../challenges.json";

interface ChallengesProviderProps {
  children: ReactNode;
}

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number
}

interface ChallengesContextData {

  level: number;
  levelUp: () => void;
  currentExperience: number;
  challengesCompleted: number;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  completeChallenge: () => void;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {

  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);


  useEffect(() => {

    Notification.requestPermission();

  }, []);


  useEffect(() => {



  }, [level, currentExperience, challengesCompleted])


  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {

    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();


    if (Notification.permission === 'granted') {

      console.log('aaaa');

      new Notification('Novo desafio', {
        body: `Valendo ${challenge.amount} xp!`
      });

    }

  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);



  }



  return (

    <ChallengesContext.Provider
      value={{
        level,
        levelUp,
        currentExperience,
        startNewChallenge,
        challengesCompleted,
        activeChallenge,
        resetChallenge,
        experienceToNextLevel,
        completeChallenge
      }}>
      {children}
    </ChallengesContext.Provider>

  )


}