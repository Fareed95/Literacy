"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { TextGenerateEffectDemo } from "./Texteffect";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "I want to Learn Django?",
    "Can we start up with MERN?",
    "I wanna build my knowledge in Drafting in Law",
    "I wanna learn Excel",
    "How can we start up with DSA in C?",
  ];

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      {/* Added margin-bottom for spacing */}
      <div className="mb-15">
        <TextGenerateEffectDemo />
      </div>
      
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
    </div>
  );
}
