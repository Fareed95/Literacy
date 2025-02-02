"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Clock, PlayIcon, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRoadmap } from '@/app/context/RoadmapContext';

export default function Home() {
  const { roadmap } = useRoadmap();
  const [componentData, setComponentData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roadmap?.roadmap_id) {
      console.log(roadmap);
      console.log(roadmap.roadmap_id);
      fetchRoadmapData(roadmap.roadmap_id);
    } else {
      setError("Roadmap ID is not available in context.");
      setIsLoading(false);
    }
  }, [roadmap]);

  const fetchRoadmapData = async (roadmapId) => {
    try {
      const response = await fetch(`http://localhost:8000/roadmaps/${roadmapId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      fetchComponentData(roadmapId, data.is_completed);
    } catch (error) {
      console.error("Error fetching roadmap data:", error);
      setError("Failed to fetch roadmap data. Please try again.");
      setIsLoading(false);
    }
  };

  const fetchComponentData = async (roadmapId, componentNumber) => {
    try {
      const response = await fetch(`http://localhost:8000/roadmaps/${roadmapId}/component`, {
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
      console.log(data);
      setComponentData(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching component data:", error);
      setError("Failed to fetch component data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswerChange = (question, answer) => {
    setQuizAnswers({ ...quizAnswers, [question]: answer });
  };

  const handleQuizSubmit = () => {
    const allAnswered = componentData.component.test_series.every(q => quizAnswers[q.question]);
    if (allAnswered) {
      setQuizCompleted(true);
    }
  };

  const handleNextComponent = () => {
    if (currentComponentIndex + 1 < roadmap.total_components) {
      setCurrentComponentIndex(prevIndex => prevIndex + 1);
      fetchComponentData(roadmap.roadmap_id, currentComponentIndex + 1);
      setQuizAnswers({});
      setQuizCompleted(false);
    } else {
      console.log("No more components available.");
      // Optionally, navigate to a completion page or show a message
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!componentData) {
    return <div>No component data available.</div>;
  }

  return (
    <div className="bg-black text-cyan-300 min-h-screen flex flex-col items-center p-4 overflow-hidden">
      <Head>
        <title>{componentData.component.name}</title>
      </Head>

      <div className="w-full max-w-7xl bg-neutral-900 border border-cyan-800/30 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 space-y-6 relative">
        {/* Futuristic Glow Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-cyan-900/10 to-transparent opacity-50 blur-3xl"></div>
        </div>

        {/* Video Section */}
        <div className="relative z-10 mb-6">
          <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-cyan-700/50 shadow-lg shadow-cyan-500/20">
            <iframe
              width="100%"
              height="100%"
              src={componentData.component.embed_url}
              title={`${componentData.component.name} Video`}
              frameBorder="0"
              className="transform transition-all hover:scale-[1.02]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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
              src={componentData.component.document} 
              width="100%" 
              height="600px" 
              className="rounded-lg border border-cyan-700/30"
              title="PDF Viewer"
            ></iframe>
            <a
              href={componentData.component.document}
              download
              className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded-md transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>

        {/* Document Section */}
        <div className="mb-6 z-10 relative">
          <div className="flex items-center mb-4 space-x-3">
            <FileText className="text-cyan-500" />
            <h3 className="text-lg font-semibold">Document Section</h3>
          </div>
          <div className="w-full bg-neutral-800 border border-cyan-800/30 rounded-xl p-4">
            <p className="text-cyan-300">Here you can read more about the topics covered in the course or explore related materials.</p>
            <a
              href={componentData.component.document}
              target="_blank"
              className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded-md transition-all transform hover:scale-105"
            >
              Open Full Document
            </a>
            setError("Roadmap ID is not available in context.");
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6 z-10 relative bg-neutral-800/50 rounded-xl p-4 border border-cyan-800/30">
          <p className="text-cyan-300 italic">{componentData.component.description}</p>
        </div>

        {/* Quiz Section */}
        <div className="z-10 relative">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-cyan-500" />
            <h2 className="text-xl font-bold">Knowledge Checkpoint</h2>
          </div>
          <div className="space-y-6">
            {componentData.component.test_series.map((q, index) => (
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
              disabled={!componentData.component.test_series.every(q => quizAnswers[q.question])}
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
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextComponent}
          className="w-full bg-cyan-600 text-black font-bold py-3 px-6 rounded-xl 
            hover:bg-cyan-500 transition-all 
            flex items-center justify-center space-x-2"
        >
          <span>Next Component</span>
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}