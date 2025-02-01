'use client';
import styles from './page.module.css';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import GaugeChart with no SSR to avoid hydration issues
const GaugeChart = dynamic(() => import('react-gauge-chart'), {
  ssr: false,
});

// Define the labels grouped by level
const labels = {
  green: [
    "We're doing fine",
    "Keep calm and carry on",
    "Pretty chill actually",
    "Not too shabby",
    "Relatively peaceful"
  ],
  yellow: [
    "Getting a bit dicey",
    "Might want to worry",
    "Moderately concerning",
    "Somewhat alarming",
    "Starting to sweat"
  ],
  red: [
    "We're in trouble",
    "Time to panic",
    "Pretty much doomed",
    "Critical situation",
    "Total chaos incoming"
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
  const [percentage, setPercentage] = useState(50);

  useEffect(() => {
    const getRandomPercentage = () => Math.floor(Math.random() * 101);
    
    // Set initial random value
    setPercentage(getRandomPercentage());

    // Update every 10 seconds
    const interval = setInterval(() => {
      setPercentage(getRandomPercentage());
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      <div className="grid grid-cols-3 h-screen w-screen">
        <div className="col-span-2 bg-stone-50 text-stone-950 flex items-center justify-center">
          <Image
            src="/howfucked.svg"
            alt="how fucked is the world, really?"
            width={419}
            height={163}
          />
        </div>
        <div className="bg-stone-950 text-stone-50 flex items-center justify-center">
          <GaugeChart 
            id="gauge-chart1" 
            nrOfLevels={20}
            formatTextValue={getCurrentLabel}
            percent={percentage / 100} // GaugeChart expects a value between 0-1
          />
        </div>
      </div>
    </main>
  );
} 

// const levels = ?;
