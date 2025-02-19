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

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-deep-indigo/20 via-soft-purple/10 to-electric-blue/5" />
    
    {/* Animated grid */}
    <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
    
    {/* Gradient dots */}
    <div className="absolute inset-0 bg-dot-white/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    
    {/* Radial gradient */}
    <div className="absolute inset-0 bg-gradient-radial from-soft-purple/20 via-transparent to-transparent" />
  </div>
);

const FloatingElements = () => {
  const elements = [
    { icon: "🎯", delay: 0 },
    { icon: "💡", delay: 0.2 },
    { icon: "🧩", delay: 0.4 },
    { icon: "🎮", delay: 0.6 },
    { icon: "🏆", delay: 0.8 },
  ];

  return (
    <div className="absolute inset-0 -z-5 overflow-hidden">
      {elements.map((el, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl"
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            y: [-20, 20, -20],
            x: index % 2 === 0 ? [-20, 20, -20] : [20, -20, 20]
          }}
          transition={{
            duration: 5,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            left: `${(index + 1) * 15}%`,
            top: `${(index + 1) * 10}%`
          }}
        >
          {el.icon}
        </motion.div>
      ))}
    </div>
  );
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
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
        <HeroBackground />
        <FloatingElements />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full glass p-8 rounded-2xl relative z-10"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-electric-blue mb-4">
              Test Your Knowledge
            </h1>
            <p className="text-neon-cyan text-lg">
              Choose a theme and challenge yourself!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme, index) => (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="glass p-8 rounded-xl hover-glow text-center relative overflow-hidden group"
                onClick={() => handleThemeSelect(theme)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 rounded-full -mr-16 -mt-16 group-hover:bg-electric-blue/10 transition-colors" />
                <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform">{theme.icon}</span>
                <h3 className="text-xl font-semibold text-neon-cyan">{theme.name}</h3>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestionData = mockQuestions[selectedTheme.id][currentQuestion];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      <HeroBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full glass p-8 rounded-2xl relative z-10"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-neon-cyan text-lg"
            >
              Question {currentQuestion + 1} of {mockQuestions[selectedTheme.id].length}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-electric-blue text-lg font-semibold"
            >
              Score: {score}
            </motion.span>
          </div>
          <div className="w-full h-3 bg-deep-indigo/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / mockQuestions[selectedTheme.id].length) * 100}%` }}
              className="h-full bg-gradient-to-r from-electric-blue to-neon-cyan rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-electric-blue">
            {currentQuestionData.question}
          </h2>
          <div className="space-y-4">
            {currentQuestionData.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full glass p-6 rounded-xl text-left hover-glow transition-all relative overflow-hidden group ${
                  answers[currentQuestion]?.answer === option
                    ? answers[currentQuestion].isCorrect
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                    : 'text-neon-cyan'
                }`}
                onClick={() => handleAnswer(option)}
                disabled={answers[currentQuestion]}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-electric-blue/5 rounded-full -mr-12 -mt-12 group-hover:bg-electric-blue/10 transition-colors" />
                <span className="relative z-10">{option}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default QuizPage; 