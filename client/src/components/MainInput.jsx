"use client";

import { useState } from 'react';
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useUserContext } from '@/app/context/Userinfo';
import Timeline_roadmap_function from './Timeline_roadmap'; // Import the context to use it as the parameteric 

function MainInput() {
  const [inputValue, setInputValue] = useState('');
  const [roadmapData, setRoadmapData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const { contextemail } = useUserContext(); 

  const placeholders = [
    "How can I learn advanced backend development?",
    "How can I learn linear algebra?",
    "How can I learn database optimization?",
    "How can I learn to design scalable APIs?",
    "How can I learn machine learning?"
  ];

  const handleChange = (e) => {
    setInputValue(e.target.value); 
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue || !contextemail) return; // Ensure input and email are present

    setLoading(true); // Start loading
    setRoadmapData(null); // Reset roadmap data

    try {
      // Make the POST request to the API
      const response = await fetch('http://localhost:8001/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_value: inputValue,
          email: contextemail,
        }),
      });

      if (!response.ok) {
        <div className="mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          Failed to get the roadmap please try again...
        </p>
      </div>
      }

      const data = await response.json();
      setRoadmapData(data); // Set the fetched roadmap data
    } catch (error) {
      console.error('Error fetching roadmap:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col justify-start items-center px-4 sm:mt-10 sm:min-h-screen">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        <div className="flex justify-center">
          Tell us what you want to <div className="text-green-500 px-2">LEARN</div>
        </div>
        <div className="flex justify-center">
          and we'll guide you with the best <div className="text-blue-500 px-2">RESOURCES</div>
        </div>
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      {/* Show loader while loading */}
      {loading && (
        <div className="mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Generating your roadmap...
          </p>
        </div>
      )}

      {/* Render the Timeline component if roadmapData is available */}
      {roadmapData && !loading && (
        <div className="mt-10 w-full">
          <Timeline_roadmap_function roadmapData={roadmapData} />
        </div>
      )}
    </div>
  );
}

export default MainInput;
