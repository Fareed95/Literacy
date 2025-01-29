"use client";

import React from "react";
import { buttons } from "@/components/Buttons"; // Import the buttons array

function Page() {
  // Find the Playlist button from the buttons array
  const playlistButton = buttons.find((button) => button.name === "Playlist");

  return (
    <div className="flex justify-center items-center min-h-screen">
      {playlistButton ? (
        <div>{playlistButton.component}</div> // Render the Playlist button component
      ) : (
        <p>Playlist button not found</p>
      )}
    </div>
  );
}

export default Page;
