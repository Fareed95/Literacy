"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/app/context/Userinfo'; // Import the useUserContext hook

function PrevCources() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the user's email from the context
  const { contextemail } = useUserContext();

  useEffect(() => {
    // Make the POST request to the API only if the email is available
    if (contextemail) {
      fetch('http://localhost:8000/user-roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: contextemail }), // Use the email from context
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch roadmaps');
          }
          return response.json();
        })
        .then((data) => {
          setRoadmaps(data); // Set the fetched roadmaps to state
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false); // If no email, stop loading
    }
  }, [contextemail]); // Re-run effect when contextemail changes

  if (loading) {
    return <div className="min-h-screen p-4 md:p-8">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen p-4 md:p-8">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-cyan-500/50 transition-all duration-300"
          >
            <Link href={`/${roadmap.name}/Roadmap`}>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">{roadmap.name}</h2>
                <div className="space-y-4">
                  {roadmap.roadmap_json?.roadmap_components?.map((component, index) => (
                    <div key={index} className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-all">
                      <h3 className="text-cyan-400 font-semibold mb-2">{component.name}</h3>
                      <p className="text-neutral-400 text-sm">
                        {component.description.substring(0, 60)}...
                      </p>
                    </div>
                  )) || <p className="text-neutral-400">No components available.</p>}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrevCources;