"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Clock, PlayIcon, FileText, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [videoLink, setVideoLink] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');
  const [pdfFile, setPdfFile] = useState('https://mirror.las.iastate.edu/tex-archive/macros/latex/contrib/pdfpages/dummy-l.pdf');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const dummyText = "Dive into a cutting-edge learning experience that transcends traditional boundaries of education and technology.";

  useEffect(() => {
    setTimeout(() => {
      const dummyQuiz = [
        {
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          answer: "Paris",
        },
        {
          question: "What is the highest mountain in the world?",
          options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"],
          answer: "Mount Everest",
        },
        {
          question: "What is the largest planet in our solar system?",
          options: ["Mars", "Jupiter", "Saturn", "Uranus"],
          answer: "Jupiter",
        },
      ];
      setQuizQuestions(dummyQuiz);
      setLoadingQuiz(false);
    }, 500);
  }, []);

  const handleInputChange = (e) => {
    setVideoLink(e.target.value);
  };

  const handleQuizAnswerChange = (question, answer) => {
    setQuizAnswers({ ...quizAnswers, [question]: answer });
  };

  const handleQuizSubmit = () => {
    const allAnswered = quizQuestions.every(q => quizAnswers[q.question]);
    if (allAnswered) {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="bg-black text-cyan-300 min-h-screen flex flex-col items-center p-4 overflow-hidden">
      <Head>
        <title>Cyber Learning Interface</title>
      </Head>

      <div className="w-full max-w-7xl bg-neutral-900 border border-cyan-800/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 space-y-6 relative">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-cyan-900/10 to-transparent opacity-50 blur-3xl"></div>
        </div>

      
        <div className="relative z-10 mb-6">
          <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-cyan-700/50 shadow-lg shadow-cyan-500/20">
            <iframe
              width="100%"
              height="100%"
              src={videoLink.replace("watch?v=", "embed/")}
              title="Cyber Learning Video"
              frameBorder="0"
              className="transform transition-all hover:scale-[1.02]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mt-4 flex items-center space-x-3">
            <PlayIcon className="text-cyan-500" />
            <input
              type="text"
              className="w-full bg-neutral-800 border border-cyan-800/50 text-cyan-200 rounded-md py-2 px-3 focus:outline-none focus:border-cyan-500 transition-all"
              value={videoLink}
              onChange={handleInputChange}
              placeholder="Enter YouTube link"
            />
          </div>
        </div>

        {/* PDF Section */}
        <div className="mb-6 z-10 relative">
          <div className="flex items-center mb-4 space-x-3">
            <FileText className="text-cyan-500" />
            <h3 className="text-lg font-semibold">Supplementary Materials</h3>
          </div>
          <div className="w-full bg-neutral-800 border border-cyan-800/30 rounded-xl p-4">
            <iframe 
              src={pdfFile} 
              width="100%" 
              height="600px" 
              className="rounded-lg border border-cyan-700/30"
              title="PDF Viewer"
            ></iframe>
            <a
              href={pdfFile}
              download
              className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded-md transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6 z-10 relative bg-neutral-800/50 rounded-xl p-4 border border-cyan-800/30">
          <p className="text-cyan-300 italic">{dummyText}</p>
        </div>

        {/* Quiz Section */}
        <div className="z-10 relative">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-cyan-500" />
            <h2 className="text-xl font-bold">Knowledge Checkpoint</h2>
          </div>
          {loadingQuiz ? (
            <div className="animate-pulse text-cyan-400">Loading quiz questions...</div>
          ) : (
            <div className="space-y-6">
              {quizQuestions.map((q, index) => (
                <div 
                  key={index} 
                  className="bg-neutral-800 border border-cyan-800/30 rounded-xl p-4 hover:border-cyan-500 transition-all"
                >
                  <p className="font-medium text-cyan-200 mb-3">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, optionIndex) => (
                      <label 
                        key={optionIndex} 
                        className="flex items-center space-x-3 cursor-pointer hover:bg-neutral-700/50 p-2 rounded-md transition-all"
                      >
                        <input
                          type="radio"
                          className="form-radio h-5 w-5 text-cyan-600 border-gray-300 focus:ring-2 focus:ring-cyan-500"
                          name={q.question}
                          value={option}
                          checked={quizAnswers[q.question] === option}
                          onChange={(e) => handleQuizAnswerChange(q.question, e.target.value)}
                        />
                        <span className="text-cyan-300">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={handleQuizSubmit}
                disabled={!quizQuestions.every(q => quizAnswers[q.question])}
                className="w-full bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl 
                  hover:bg-cyan-500 transition-all 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2"
              >
                {quizCompleted ? (
                  <>
                    <CheckCircle2 />
                    <span>Quiz Completed</span>
                  </>
                ) : (
                  <span>Submit Quiz</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}