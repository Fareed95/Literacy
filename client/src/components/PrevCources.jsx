"use client"

import Link from 'next/link';
import React, { useState } from 'react';

function PrevCources() {
  const [roadmaps] = useState([
    {
      "id": 2,
      "name": "MERN",
      "roadmap_json": {
        "pdf_links": [
          "https://media.geeksforgeeks.org/courses/Brochure/MERN-Final.pdf",
          "https://d2lk14jtvqry1q.cloudfront.net/media/4a_Mern_Stack_Web_Development_bed87ec2f5.pdf",
          "https://www.softlogicsys.in/wp-content/uploads/2024/10/MERN-Stack-Tutorial-for-Web-Development-Aspirants.pdf",
          "https://edu.anarcho-copy.org/Programming%20Languages/Node/Pro%20MERN%20Stack,%202nd%20Edition.pdf",
          "https://coko-bucket.s3.ap-south-1.amazonaws.com/MERN_Stack_brochure_copy_86955bc9d6.pdf"
        ],
        "roadmap_components": [
          {
            "description": "Learn the fundamentals of JavaScript, including data types, functions, loops, and object-oriented programming.",
            "document": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            "embed_url": "https://www.youtube.com/embed/htznIeWKgg8",
            "name": "JavaScript Basics",
            "test_series": [
              {
                "answer": "To declare a variable",
                "options": [
                  "To declare a variable",
                  "To define a function",
                  "To create an object",
                  "To use a loop"
                ],
                "question": "What is the primary use of the 'let' keyword in JavaScript?"
              },
              {
                "answer": "=='' checks for equality, while '===' checks for identity",
                "options": [
                  "=='' checks for equality, while '===' checks for identity",
                  "=='' checks for identity, while '===' checks for equality",
                  "=='' checks for type, while '===' checks for value",
                  "=='' checks for value, while '===' checks for type"
                ],
                "question": "What is the difference between '=='' and '===' in JavaScript?"
              },
              {
                "answer": "To refer to the current object",
                "options": [
                  "To refer to the current object",
                  "To refer to the global object",
                  "To refer to the parent object",
                  "To refer to the child object"
                ],
                "question": "What is the purpose of the 'this' keyword in JavaScript?"
              }
            ]
          },
          // More components...
        ],
        "roadmap_name": "MERN",
        "total_components": 6
      }
    },
    // More roadmaps...
  ]);

  return (
    <div className="min-h-screen  p-4 md:p-8">
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
                {/* Use optional chaining and provide a fallback */}
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