"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';
import { useUserContext } from '@/app/context/Userinfo';
import { CompressedTextureLoader } from 'three/src/Three.Core.js';

function PrevCources() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setRoadmap } = useRoadmap();
  const { contextemail } = useUserContext();

  useEffect(() => {
    if (contextemail) {
      fetch('http://localhost:8001/user-roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contextemail }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch roadmaps');
          }
          return response.json();
        })
        .then((data) => {
          setRoadmaps(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [contextemail]);

  const handleCardClick = (roadmap) => {
    setRoadmap({
      
      roadmap_id: roadmap.id,
    });
    console.log(roadmap.id);
    console.log(roadmap.total_components);
    router.push('/Learning'); // Navigate to Learning page
  };

  if (loading) return <div className="min-h-screen p-4 md:p-8">Loading...</div>;
  if (error) return <div className="min-h-screen p-4 md:p-8">Error: {error}</div>;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
            onClick={() => handleCardClick(roadmap)} // Clicking whole card triggers navigation
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">{roadmap.name}</h2>
              <div className="space-y-4">
                {roadmap.roadmap_json?.roadmap_components?.length > 0 ? (
                  roadmap.roadmap_json.roadmap_components.map((component, index) => (
                    <div key={index} className="p-4 bg-neutral-800 rounded-lg">
                      <h3 className="text-cyan-400 font-semibold mb-2">{component.name}</h3>
                      <p className="text-neutral-400 text-sm">
                        {component.description.substring(0, 60)}...
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400">No components available.</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrevCources;