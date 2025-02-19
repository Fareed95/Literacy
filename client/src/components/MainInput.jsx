"use client";

import { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useUserContext } from "@/app/context/Userinfo";
import Timeline_roadmap_function from "./Timeline_roadmap";

function MainInput() {
  const [inputValue, setInputValue] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { contextemail } = useUserContext();
  
  const MODEL_API_SERVER = process.env.NEXT_PUBLIC_MODEL_API_SERVER; // Fetch API URL from .env

  const placeholders = [
    "How can I learn advanced backend development?",
    "How can I learn linear algebra?",
    "How can I learn database optimization?",
    "How can I learn to design scalable APIs?",
    "How can I learn machine learning?",
  ];

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue || !contextemail || !MODEL_API_SERVER) return;

    setLoading(true);
    setRoadmapData(null);

    const MAX_RETRIES = 3;
    let attempts = 0;
    let success = false;

    while (attempts < MAX_RETRIES && !success) {
      try {
        const response = await fetch(`${MODEL_API_SERVER}/generate-roadmap-first-component`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input_value: inputValue,
            email: contextemail,
          }),
        });

        if (!response.ok) {
          attempts++;
          if (attempts >= MAX_RETRIES) {
            window.alert("Failed to load roadmap. Please try again.");
          }
        } else {
          const data = await response.json();
          setRoadmapData(data);
          console.log("Roadmap data loaded successfully:", data);
          success = true;
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts >= MAX_RETRIES) {
          window.alert("Failed to load roadmap. Please try again.");
        }
      }
    }

    setLoading(false);
  };

  // Make POST request when roadmapData is updated and has a valid roadmap_id
  useEffect(() => {
    if (roadmapData?.roadmap_id) {
      console.log("Sending request to generate-roadmap-all for roadmap_id:", roadmapData.roadmap_id);
      fetch(`${MODEL_API_SERVER}/generate-roadmap-all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: roadmapData.roadmap_id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Roadmap all generated successfully:", data);
        })
        .catch((error) => {
          console.error("Error generating full roadmap:", error);
        });
    }
  }, [roadmapData]); // Runs only when roadmapData changes

  
  return (
    <div className="flex flex-col justify-start items-center px-4">
      <h2 className="mb-8 text-xl text-center sm:text-5xl glass p-8 rounded-2xl backdrop-blur-md">
        <div className="flex justify-center items-center space-x-2 floating">
          Tell us what you want to <span className="text-electric-blue font-bold px-2 hover-glow">LEARN</span>
        </div>
        <div className="flex justify-center items-center space-x-2 mt-4">
          and we'll guide you with the best <span className="text-neon-cyan font-bold px-2 hover-glow">RESOURCES</span>
        </div>
      </h2>

      <div className="w-full max-w-2xl glass p-4 rounded-xl">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      {loading && (
        <div className="mt-8 glass p-6 rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electric-blue"></div>
          <p className="mt-4 text-neon-cyan">
            Generating your roadmap...
          </p>
        </div>
      )}

      {roadmapData && !loading && (
        <div className="mt-8 w-full glass p-6 rounded-xl page-transition">
          <Timeline_roadmap_function roadmapData={roadmapData} />
        </div>
      )}
    </div>
  );
}

export default MainInput;
