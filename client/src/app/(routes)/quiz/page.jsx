'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const themes = [
  { id: 'web', name: 'Web Development', icon: '💻' },
  { id: 'mobile', name: 'Mobile Development', icon: '📱' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
  { id: 'data', name: 'Data Science', icon: '📊' },
  { id: 'cloud', name: 'Cloud Computing', icon: '☁️' },
  { id: 'security', name: 'Cybersecurity', icon: '🔒' },
];

const mockQuestions = {
  web: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Hybrid Text Management Language"
      ],
      correct: "Hyper Text Markup Language"
    },
    {
      id: 2,
      question: "Which of these is a JavaScript framework?",
      options: ["Django", "Flask", "React", "Ruby"],
      correct: "React"
    },
    {
      id: 3,
      question: "What is CSS used for?",
      options: [
        "Database Management",
        "Styling Web Pages",
        "Server Configuration",
        "Network Security"
      ],
      correct: "Styling Web Pages"
    },
    {
      id: 4,
      question: "What is the latest version of HTML?",
      options: ["HTML4", "HTML5", "HTML6", "HTML7"],
      correct: "HTML5"
    },
    {
      id: 5,
      question: "Which tag is used for creating hyperlinks?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correct: "<a>"
    },
    {
      id: 6,
      question: "What is the purpose of JavaScript?",
      options: [
        "Styling",
        "Structure",
        "Interactivity",
        "Database Management"
      ],
      correct: "Interactivity"
    },
    {
      id: 7,
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Integration",
        "Automated Program Interface",
        "Application Process Integration"
      ],
      correct: "Application Programming Interface"
    },
    {
      id: 8,
      question: "Which is a CSS preprocessor?",
      options: ["SASS", "Java", "Python", "PHP"],
      correct: "SASS"
    },
    {
      id: 9,
      question: "What is Redux used for?",
      options: [
        "State Management",
        "Database Operations",
        "Server Configuration",
        "UI Design"
      ],
      correct: "State Management"
    },
    {
      id: 10,
      question: "What is webpack?",
      options: [
        "Module Bundler",
        "Programming Language",
        "Database System",
        "Web Server"
      ],
      correct: "Module Bundler"
    },
    {
      id: 11,
      question: "What is the purpose of npm?",
      options: [
        "Package Manager",
        "Web Browser",
        "Code Editor",
        "Operating System"
      ],
      correct: "Package Manager"
    },
    {
      id: 12,
      question: "What is responsive design?",
      options: [
        "Fast Loading Websites",
        "Adapting to Different Screen Sizes",
        "Secure Websites",
        "Database Design"
      ],
      correct: "Adapting to Different Screen Sizes"
    }
  ],
  // Add more themes with their respective questions here
};

function QuizPage() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const router = useRouter();

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
  };

  const handleAnswer = (answer) => {
    const isCorrect = answer === mockQuestions[selectedTheme.id][currentQuestion].correct;
    setAnswers({
      ...answers,
      [currentQuestion]: { answer, isCorrect }
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < mockQuestions[selectedTheme.id].length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Navigate to congratulations page with score
      router.push(`/quiz/congratulations?score=${score}&total=${mockQuestions[selectedTheme.id].length}&theme=${selectedTheme.name}`);
    }
  };

  if (!selectedTheme) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full glass p-8 rounded-2xl"
        >
          <h1 className="text-3xl font-bold text-electric-blue text-center mb-8">
            Choose Your Quiz Theme
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass p-6 rounded-xl hover-glow text-center"
                onClick={() => handleThemeSelect(theme)}
              >
                <span className="text-4xl mb-2 block">{theme.icon}</span>
                <h3 className="text-lg font-semibold text-neon-cyan">{theme.name}</h3>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestionData = mockQuestions[selectedTheme.id][currentQuestion];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full glass p-8 rounded-2xl"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neon-cyan">
              Question {currentQuestion + 1} of {mockQuestions[selectedTheme.id].length}
            </span>
            <span className="text-electric-blue">
              Score: {score}
            </span>
          </div>
          <div className="w-full h-2 bg-deep-indigo/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / mockQuestions[selectedTheme.id].length) * 100}%` }}
              className="h-full bg-electric-blue"
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-electric-blue mb-6">
            {currentQuestionData.question}
          </h2>
          <div className="space-y-4">
            {currentQuestionData.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full glass p-4 rounded-xl text-left hover-glow transition-all ${
                  answers[currentQuestion]?.answer === option
                    ? answers[currentQuestion].isCorrect
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                    : 'text-neon-cyan'
                }`}
                onClick={() => handleAnswer(option)}
                disabled={answers[currentQuestion]}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default QuizPage; 