"use client";

import React from 'react';
import { Timeline } from "@/components/ui/timeline"; // Import the Timeline component

function Timeline_roadmap_function({ roadmapData }) {
  // Check if roadmapData is defined and has the required properties
  if (!roadmapData || !roadmapData.roadmap_name || !roadmapData.roadmap_components) {
    return (
      <div className="text-neutral-800 dark:text-neutral-200 text-center py-8">
        No roadmap data available. Please try again.
      </div>
    );
  }

  // Transform the roadmap data into the format required by the Timeline component
  const timelineData = roadmapData.roadmap_components.map((component, index) => ({
    id: index + 1, // Unique ID for each component
    title: component.name, // Use the component name as the title
    content: (
      <div>
        <p className="text-neutral-600 dark:text-neutral-400">
          {component.description}
        </p>
      </div>
    ), // Use the component description as the content
  }));

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Render the Timeline component with the transformed data */}
        <Timeline data={timelineData} />
      </div>
      <div className="h-[60vh]"></div>
    </div>
  );
}

export default Timeline_roadmap_function;