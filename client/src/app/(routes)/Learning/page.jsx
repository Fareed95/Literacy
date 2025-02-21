"use client";

import { useState, useEffect } from 'react';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { motion } from 'framer-motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-neutral-950" />
    <div className="absolute inset-0 bg-grid-small-white/[0.05] -z-10" />
    <div className="absolute inset-0 bg-dot-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
    <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />
  </div>
);

export default function Learning() {
  const { roadmap } = useRoadmap();
  const [currentComponent, setCurrentComponent] = useState(0);
  const [componentData, setComponentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);

  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER;

  useEffect(() => {
    if (roadmap?.roadmap_id) {
      fetchComponentData(roadmap.roadmap_id, currentComponent);
    }
  }, [roadmap, currentComponent]);

  const fetchComponentData = async (roadmapId, componentNumber) => {
    try {
      setLoading(true);
      const response = await fetch(`${MODEL_API_SERVER}/get-roadmap-component`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roadmap_id: roadmapId,
          component_number: componentNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch component data');
      }

      const data = await response.json();
      setComponentData(data);
      setLoading(false);
    } catch (error) {
<<<<<<< HEAD
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
=======
      console.error('Error fetching component data:', error);
      setLoading(false);
>>>>>>> 0a2ddd450b0d93e6d8f49b4cad04cdc659b3738c
    }
  };

  const handleQuizAnswer = (questionIndex, selectedAnswer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer
    }));
  };

  const checkQuizCompletion = () => {
    if (!componentData?.quiz) return false;
    return componentData.quiz.every((_, index) => quizAnswers[index] !== undefined);
  };

  return (
    <div className="relative min-h-screen w-full px-4 py-20">
      <HeroBackground />
      
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-400"></div>
          </div>
        ) : componentData ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-xl backdrop-blur-sm relative group">
              <GlowingEffect className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-neutral-200 mb-4">
                  {componentData.title || 'Learning Module'}
                </h1>
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: componentData.content }} />
                </div>
              </div>
            </div>

            {componentData.quiz && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 rounded-xl backdrop-blur-sm relative group"
              >
                <GlowingEffect className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-neutral-200 mb-6">Knowledge Check</h2>
                  <div className="space-y-6">
                    {componentData.quiz.map((question, index) => (
                      <div key={index} className="space-y-4">
                        <p className="text-neutral-200 font-medium">{question.question}</p>
                        <div className="grid grid-cols-1 gap-3">
                          {question.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              onClick={() => handleQuizAnswer(index, optionIndex)}
                              className={`p-4 rounded-lg text-left transition-all duration-300 ${
                                quizAnswers[index] === optionIndex
                                  ? 'bg-neutral-700 text-white'
                                  : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/50'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentComponent(prev => Math.max(0, prev - 1))}
                disabled={currentComponent === 0}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  currentComponent === 0
                    ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentComponent(prev => prev + 1)}
                disabled={!checkQuizCompletion()}
                className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                  !checkQuizCompletion()
                    ? 'bg-neutral-800/50 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-neutral-400">
            No content available
          </div>
        )}
      </div>
    </div>
  );
}