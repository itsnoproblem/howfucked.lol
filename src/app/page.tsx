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
      <div className="grid grid-cols-1 md:grid-cols-3 h-screen w-screen">
        <div className="col-span-1 md:col-span-2 bg-stone-50 text-stone-950 flex items-center justify-center">
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
            percent={percentage / 100}
            // Array of 20 colors transitioning from green to yellow to red
            colors={[
              '#22c55e', // green-500 (0-40%)
              '#22c55e',
              '#22c55e',
              '#22c55e',
              '#34d27a',
              '#46dd96',
              '#58e4b2',
              '#6aebce',
              '#eab308', // yellow transition (40-70%)
              '#eab308',
              '#eab308',
              '#f59e0b',
              '#f97316',
              '#fb7185',
              '#ef4444', // red-500 (70-100%)
              '#ef4444',
              '#ef4444',
              '#ef4444',
              '#ef4444',
              '#ef4444',
            ]}
            textColor="#f8fafc" // slate-50
            cornerRadius={0} // Make segments less rounded
          />
        </div>
      </div>
    </main>
  );
} 

// const levels = ?;
