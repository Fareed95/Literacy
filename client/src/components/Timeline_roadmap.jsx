"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useRoadmap } from '@/app/context/RoadmapContext';  // Import the custom hook
import { Timeline } from "@/components/ui/timeline";  
import { buttons } from "@/components/Button";

function Timeline_roadmap_function({ roadmapData }) {
  const router = useRouter();
  const { setRoadmap } = useRoadmap();  // Get the setRoadmap function from context

  if (!roadmapData || !roadmapData.roadmap_name || !roadmapData.roadmap_components) {
    return (
      <div className="text-neutral-800 dark:text-neutral-200 text-center py-8">
        No roadmap data available. Please try again.
      </div>
    );
  }

  const timelineData = roadmapData.roadmap_components.map((component, index) => ({
    id: index + 1,
    title: component.name,
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400">
          {component.description}
        </p>
      </div>
    ),
  }));

  const playlistButton = buttons.find(button => button.name === "Playlist");

  // Set the roadmap data to context when the component is mounted
  const handleButtonClick = () => {
    // Set the roadmap data in context
    setRoadmap({
      roadmap_id: roadmapData.roadmap_id, // Send the roadmap id
      total_components: roadmapData.total_components,  // Send the total components count
    });
    router.push('/Learning');  // Navigate to the Learning page
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Timeline data={timelineData} />
        {timelineData.length > 0 && playlistButton && (
          <div className="flex justify-center">
            <div className="m-0 p-0">
              {/* Override button text and add onClick handler */}
              {React.cloneElement(playlistButton.component, {
                onClick: handleButtonClick,  // Handle the click event
              }, "LET'S GET STARTED")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Timeline_roadmap_function;
