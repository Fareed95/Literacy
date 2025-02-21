"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Clock, FileText, ArrowRight, BookOpen, Award, BarChart } from 'lucide-react';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  const { roadmap } = useRoadmap();
  const [componentData, setComponentData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapId, setRoadmapId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(null);
  const router = useRouter();
  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  useEffect(() => {
    if (roadmap?.roadmap_id) {
      setRoadmapId(roadmap.roadmap_id);
      fetchRoadmapData(roadmap.roadmap_id);
    } else {
      router.push('/');
    }
  }, [roadmap]);

  const fetchComponentData = async (roadmapId, componentNumber) => {
    try {
      if (componentNumber == 0) {
        console.log("Setting first component data:", roadmap.first_component);
        setComponentData(roadmap.first_component);
      } else {
        const response = await fetch(`${MODEL_API_SERVER}/roadmaps/${roadmapId}/component`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ component_number: componentNumber }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched component data:", data);
        setComponentData(data);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching component data:", error);
      setError("Failed to fetch component data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchRoadmapData = async (roadmapId) => {
    try {
      const response = await fetch(`${MODEL_API_SERVER}/roadmaps/${roadmapId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setIsCompleted(data.is_completed);
      fetchComponentData(roadmapId, data.is_completed);
      console.log( data.is_completed ,roadmapId );
    } catch (error) {
      console.error("Error fetching roadmap data:", error);
      setError("Failed to fetch roadmap data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated isCompleted:", isCompleted);
  }, [isCompleted]);

  

  const handleNextComponent = async () => {
    if (currentComponentIndex + 1 < roadmap.total_components) {
      try {
        const newCompletedIndex = currentComponentIndex + 1;
        const response = await fetch(`${MODEL_API_SERVER}/roadmaps/${roadmapId}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_completed: newCompletedIndex }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setIsCompleted(newCompletedIndex);
        setCurrentComponentIndex(newCompletedIndex);
        fetchComponentData(roadmapId, newCompletedIndex);
        setQuizAnswers({});
        setQuizCompleted(false);
      } catch (error) {
        console.error("Error updating completion status:", error);
        setError("Failed to update completion status. Please try again.");
      }
    } else {
      console.log("No more components available.");
    }
  };

  const handleQuizAnswer = (questionIndex, selectedAnswer) => {
    setQuizAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedAnswer,
    }));
  };

  const checkQuizCompletion = () => {
    if (!componentData || !componentData.component || !componentData.component.test_series) {
      setQuizCompleted(false);
      return;
    }

    const allQuestionsAnswered = componentData.component.test_series.every(
      (_, index) => quizAnswers[index] !== undefined
    );
    setQuizCompleted(allQuestionsAnswered);
  };

  useEffect(() => {
    checkQuizCompletion();
  }, [quizAnswers]);

  if (isLoading) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        {...fadeIn}
        className="glass p-8 rounded-2xl text-center max-w-md mx-4"
      >
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-electric-blue mb-4">Error</h2>
        <p className="text-neon-cyan mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="neon-btn"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );

  if (!componentData) return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <motion.div
        {...fadeIn}
        className="glass p-8 rounded-2xl text-center max-w-md mx-4"
      >
        <BookOpen className="w-16 h-16 text-electric-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-electric-blue mb-4">No Content Available</h2>
        <p className="text-neon-cyan mb-6">Please select a learning path to begin.</p>
        <button
          onClick={() => router.push('/')}
          className="neon-btn"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
console.log("componentData",componentData);
  return (
    <>
      {isCompleted === 0 ? (
        <div className="bg-neutral-950 text-white min-h-screen flex flex-col items-center p-4 overflow-hidden">
          <Head>
            <title>{componentData.name}</title>
          </Head>
  
          <motion.div {...fadeIn} className="w-full max-w-7xl glass border border-soft-purple/20 rounded-2xl shadow-2xl p-6 space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-electric-blue">{componentData.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <BarChart className="w-4 h-4 text-neon-cyan" />
                  <span className="text-neon-cyan">
                    Progress: {Math.round((currentComponentIndex / roadmap.total_components) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-neon-cyan">Component</p>
                  <p className="text-lg font-bold text-electric-blue">
                    {currentComponentIndex + 1} / {roadmap.total_components}
                  </p>
                </div>
                <Award className="w-8 h-8 text-electric-blue" />
              </div>
            </div>
  
            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {componentData.videos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl overflow-hidden hover-glow"
                >
                  <iframe
                    width="100%"
                    height="200"
                    src={video}
                    title={`${componentData.name} Video ${index + 1}`}
                    frameBorder="0"
                    className="transform transition-all hover:scale-[1.02]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              ))}
            </motion.div>
  
            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-xl border border-soft-purple/20"
            >
              <h2 className="text-xl font-bold text-electric-blue mb-4">Overview</h2>
              <p className="text-neon-cyan">{componentData.description}</p>
            </motion.div>
  
            {/* Supplementary Materials Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="text-electric-blue" />
                <h3 className="text-lg font-semibold text-electric-blue">Learning Materials</h3>
              </div>
              <div className="glass p-6 rounded-xl border border-soft-purple/20">
                <iframe
                  src={componentData.document}
                  width="100%"
                  height="600px"
                  className="rounded-lg mb-4"
                  title="PDF Viewer"
                />
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={componentData.document}
                  download
                  className="neon-btn inline-flex items-center space-x-2"
                >
                  <FileText size={20} />
                  <span>Download PDF</span>
                </motion.a>
              </div>
            </motion.div>
  
            {/* Quiz Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="text-electric-blue" />
                <h2 className="text-xl font-semibold text-electric-blue">Knowledge Check</h2>
              </div>
              <div className="glass p-6 rounded-xl border border-soft-purple/20">
              {componentData.test_series.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <h3 className="text-lg font-semibold text-electric-blue mb-4">{question.question}</h3>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-3 p-3 glass rounded-lg cursor-pointer transition-all hover:bg-deep-indigo/20"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            onChange={() => handleQuizAnswer(index, option)}
                            className="form-radio text-electric-blue"
                          />
                          <span className="text-neon-cyan">{option}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
  
            {/* Next Component Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextComponent}
              className="neon-btn w-full flex items-center justify-center space-x-2"
            >
              <span>Next Component</span>
              <ArrowRight />
            </motion.button>
          </motion.div>
        </div>
      ) : (
        <div className="bg-neutral-950 text-white min-h-screen flex flex-col items-center p-4 overflow-hidden">
          <Head>
            <title>{componentData.component.name}</title>
          </Head>
  
          <motion.div {...fadeIn} className="w-full max-w-7xl glass border border-soft-purple/20 rounded-2xl shadow-2xl p-6 space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-electric-blue">{componentData.component.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <BarChart className="w-4 h-4 text-neon-cyan" />
                  <span className="text-neon-cyan">
                    Progress: {Math.round((currentComponentIndex / roadmap.total_components) * 100)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-neon-cyan">Component</p>
                  <p className="text-lg font-bold text-electric-blue">
                    {currentComponentIndex + 1} / {roadmap.total_components}
                  </p>
                </div>
                <Award className="w-8 h-8 text-electric-blue" />
              </div>
            </div>
  
            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {componentData.component.videos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl overflow-hidden hover-glow"
                >
                  <iframe
                    width="100%"
                    height="200"
                    src={video}
                    title={`${componentData.component.name} Video ${index + 1}`}
                    frameBorder="0"
                    className="transform transition-all hover:scale-[1.02]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              ))}
            </motion.div>
  
            {/* Description Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-xl border border-soft-purple/20"
            >
              <h2 className="text-xl font-bold text-electric-blue mb-4">Overview</h2>
              <p className="text-neon-cyan">{componentData.component.description}</p>
            </motion.div>
  
            {/* Supplementary Materials Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="text-electric-blue" />
                <h3 className="text-lg font-semibold text-electric-blue">Learning Materials</h3>
              </div>
              <div className="glass p-6 rounded-xl border border-soft-purple/20">
                <iframe
                  src={componentData.component.document}
                  width="100%"
                  height="600px"
                  className="rounded-lg mb-4"
                  title="PDF Viewer"
                />
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={componentData.component.document}
                  download
                  className="neon-btn inline-flex items-center space-x-2"
                >
                  <FileText size={20} />
                  <span>Download PDF</span>
                </motion.a>
              </div>
            </motion.div>
  
            {/* Quiz Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="text-electric-blue" />
                <h2 className="text-xl font-semibold text-electric-blue">Knowledge Check</h2>
              </div>
              <div className="glass p-6 rounded-xl border border-soft-purple/20">
                {componentData.component.test_series.map((question, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <h3 className="text-lg font-semibold text-electric-blue mb-4">{question.question}</h3>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-3 p-3 glass rounded-lg cursor-pointer transition-all hover:bg-deep-indigo/20"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            onChange={() => handleQuizAnswer(index, option)}
                            className="form-radio text-electric-blue"
                          />
                          <span className="text-neon-cyan">{option}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                ))}
  
                {quizCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 glass p-6 rounded-xl"
                  >
                    <h3 className="text-xl font-bold text-electric-blue mb-4">Quiz Results</h3>
                    {componentData.component.test_series.map((question, index) => (
                      <div key={index} className="mb-4">
                        <p className="font-semibold text-neon-cyan">{question.question}</p>
                        <p className={`mt-2 ${quizAnswers[index] === question.answer ? 'text-green-500' : 'text-red-500'}`}>
                          Your answer: {quizAnswers[index]}
                          {quizAnswers[index] === question.answer ? " ✅" : " ❌"}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
  
            {/* Next Component Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextComponent}
              className="neon-btn w-full flex items-center justify-center space-x-2"
            >
              <span>Next Component</span>
              <ArrowRight />
            </motion.button>
          </motion.div>
        </div>
      )}
    </>
  );
  
}