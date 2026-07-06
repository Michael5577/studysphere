export type BreakChallengeCategory = "logic" | "math" | "vocabulary" | "science";

export interface BreakChallenge {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
  category: BreakChallengeCategory;
}

const CHALLENGES: BreakChallenge[] = [
  {
    id: "logic-1",
    prompt: "What comes next in the pattern: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    correctIndex: 1,
    hint: "Add increasing even numbers: +4, +6, +8, +10…",
    category: "logic",
  },
  {
    id: "math-1",
    prompt: "A train travels 60 km in 45 minutes. What is its average speed in km/h?",
    options: ["60 km/h", "75 km/h", "80 km/h", "90 km/h"],
    correctIndex: 2,
    hint: "45 minutes is 0.75 hours. Divide distance by time.",
    category: "math",
  },
  {
    id: "vocab-1",
    prompt: "Which word is closest in meaning to “meticulous”?",
    options: ["Careless", "Detailed", "Rapid", "Loud"],
    correctIndex: 1,
    hint: "Think careful, precise, thorough.",
    category: "vocabulary",
  },
  {
    id: "logic-2",
    prompt: "If all bloops are razzies, and all razzies are lazzies, are all bloops lazzies?",
    options: ["Yes", "No", "Only some", "Cannot tell"],
    correctIndex: 0,
    hint: "This is a classic transitive logic chain.",
    category: "logic",
  },
  {
    id: "math-2",
    prompt: "What is 15% of 240?",
    options: ["24", "30", "36", "48"],
    correctIndex: 2,
    hint: "10% of 240 is 24. Add half of that for 15%.",
    category: "math",
  },
  {
    id: "science-1",
    prompt: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
    hint: "Named after the Roman god of war.",
    category: "science",
  },
  {
    id: "logic-3",
    prompt: "How many times can you subtract 5 from 25?",
    options: ["Once", "Four times", "Five times", "Unlimited"],
    correctIndex: 0,
    hint: "After the first subtraction, you're no longer subtracting from 25.",
    category: "logic",
  },
  {
    id: "vocab-2",
    prompt: "“Ephemeral” most nearly means…",
    options: ["Lasting forever", "Short-lived", "Very large", "Highly valuable"],
    correctIndex: 1,
    hint: "Think of a brief moment that fades quickly.",
    category: "vocabulary",
  },
  {
    id: "math-3",
    prompt: "What is the square root of 144?",
    options: ["10", "11", "12", "14"],
    correctIndex: 2,
    hint: "Which number multiplied by itself gives 144?",
    category: "math",
  },
  {
    id: "science-2",
    prompt: "Water boils at 100 °C at standard pressure. At what temperature does it freeze?",
    options: ["−10 °C", "0 °C", "10 °C", "32 °C"],
    correctIndex: 1,
    hint: "The Celsius scale was designed around water's freezing point.",
    category: "science",
  },
  {
    id: "logic-4",
    prompt: "A bat and ball cost $1.10 total. The bat costs $1.00 more than the ball. How much is the ball?",
    options: ["$0.05", "$0.10", "$0.15", "$0.20"],
    correctIndex: 0,
    hint: "If the ball were 10 cents, the bat would be $1.10 — too much total.",
    category: "logic",
  },
  {
    id: "vocab-3",
    prompt: "Which word means the opposite of “ambiguous”?",
    options: ["Vague", "Clear", "Complex", "Hidden"],
    correctIndex: 1,
    hint: "You want a word that means definite or explicit.",
    category: "vocabulary",
  },
];

export function getRandomBreakChallenge(
  excludeId?: string,
): BreakChallenge {
  const pool = excludeId
    ? CHALLENGES.filter((challenge) => challenge.id !== excludeId)
    : CHALLENGES;

  return pool[Math.floor(Math.random() * pool.length)] ?? CHALLENGES[0];
}
