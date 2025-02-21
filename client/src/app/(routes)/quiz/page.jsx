'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// const themes = [
//   { id: 'web', name: 'Web Development', icon: '💻' },
//   { id: 'mobile', name: 'Mobile Development', icon: '📱' },
//   { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
//   { id: 'data', name: 'Data Science', icon: '📊' },
//   { id: 'cloud', name: 'Cloud Computing', icon: '☁️' },
//   { id: 'security', name: 'Cybersecurity', icon: '🔒' },
// ];

const mockQuestions = [
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
  ];
  // Add more themes with their respective questions here

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
  </div>
);

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const router = useRouter();

  const handleAnswer = (answer) => {
    const isCorrect = answer === mockQuestions[currentQuestion].correct;
    setAnswers({
      ...answers,
      [currentQuestion]: { answer, isCorrect }
    });

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion < mockQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Navigate to congratulations page with score
      router.push(`/quiz/congratulations?score=${score}&total=${mockQuestions.length}&theme=Web Development`);
    }
  };

  const currentQuestionData = mockQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      <HeroBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl relative z-10 backdrop-blur-sm"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-neutral-400 text-lg"
            >
              Question {currentQuestion + 1} of {mockQuestions.length}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-neutral-200 text-lg font-semibold"
            >
              Score: {score}
            </motion.span>
          </div>
          <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
              className="h-full bg-neutral-600 rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-semibold text-neutral-200">
            {currentQuestionData.question}
          </h2>

          {/* Options */}
          <div className="grid gap-4">
            {currentQuestionData.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-xl transition-all ${
                  answers[currentQuestion]?.answer === option
                    ? answers[currentQuestion].isCorrect
                      ? 'bg-neutral-700 text-neutral-200'
                      : 'bg-neutral-800 text-neutral-400'
                    : 'bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300'
                }`}
                disabled={answers[currentQuestion]}
              >
                <span className="flex items-center space-x-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border border-neutral-600 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default QuizPage; 