'use client';
import styles from './page.module.css';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, useCallback } from 'react';

// Dynamically import GaugeChart with no SSR to avoid hydration issues
const GaugeChart = dynamic(() => import('react-gauge-chart'), {
  ssr: false,
});

// Define the labels grouped by level
const labels = {
  green: [
    "The grass is green, man! 😎",
    "Keep calm and carry on",
    "Pretty chill actually",
    "Not too shabby",
    "We're doing fine. Everything is fine."
  ],
  yellow: [
    "Getting a bit dicey",
    "Monopolization is on the rise",
    "Moderately concerning",
    "Somewhat alarming",
    "Bribery is now technically legal 🤢",
    "Starting to sweat"
  ],
  red: [
    "We're in trouble",
    "Time to panic",
    "They're eating the pets! 😬",
    "Nazi salutes in the Capitol! 🤮",
    "Nothing fucking matters anymore! 😭"
  ]
} as const;

type Level = keyof typeof labels;

const getRandomLabel = (level: Level): string => {
  const levelLabels = labels[level];
  return levelLabels[Math.floor(Math.random() * levelLabels.length)];
};

const numberToLevel = (value: number): Level => {
  if (value <= 40) return 'green';
  if (value <= 70) return 'yellow';
  return 'red';
};

const getCurrentLabel = (percentage: string): string => {
  // Convert "40%" to 40
  const numericValue = parseFloat(percentage);
  const level = numberToLevel(numericValue);
  return getRandomLabel(level);
};

export default function Home() {
  // Start with a fixed initial value
  const [percentage, setPercentage] = useState(40);
  const [isClient, setIsClient] = useState(false);
  const updateIntervalRef = useRef<NodeJS.Timeout>();
  
  const getRandomPercentage = () => Math.floor(Math.random() * 101);
  
  const updatePercentage = useCallback(() => {
    setPercentage(getRandomPercentage());
  }, []);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only start the interval after initial client-side render
  useEffect(() => {
    if (!isClient) return;
    
    // Set initial random value
    updatePercentage();

    // Update every 10 seconds
    updateIntervalRef.current = setInterval(updatePercentage, 10000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isClient, updatePercentage]);

  return (
    <main className="h-screen w-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 h-full">
        <div 
          className="col-span-1 md:col-span-2 bg-white dark:bg-stone-50 flex items-center justify-center p-8 cursor-pointer" 
          onClick={updatePercentage}
        >
          <Image
            src="/howfucked.svg"
            alt="how fucked is the world, really?"
            width={419}
            height={163}
            priority
          />
        </div>
        <div className="bg-black dark:bg-stone-950 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">
            <GaugeChart 
              id="gauge-chart1" 
              nrOfLevels={20}
              percent={percentage / 100}
              hideText={true}
            />
          </div>
          {isClient && (
            <div className="text-white text-center mt-4 text-xl font-raleway">
              {getCurrentLabel(percentage.toString())}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 

// const levels = ?;
