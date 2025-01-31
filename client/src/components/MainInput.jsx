"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

function MainInput() {
  const placeholders = [
    "How can I learn advanced backend development?",
    "How can I learn linear algebra?",
    "How can I learn database optimization?",
    "How can I learn to design scalable APIs?",
    "How can I learn machine learning?"
]

;

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    (<div className=" flex flex-col justify-center  items-center px-4 sm:min-h-screen">
      <h2
        className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        <div className="flex justify-center t">Tell us what you want to  <div className=" text-green-500 px-2"> LEARN</div></div>
        <div className="flex justify-center">and we'll guide you with the best <div className=" text-blue-500 px-2"> RESOURCES</div></div>
      </h2>
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h2
        className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        <div className="flex justify-center">Tell us what you want to  <div className=" text-green-500 px-2"> LEARN</div></div>
        <div className="flex justify-center">and we'll guide you with the best <div className=" text-blue-500 px-2"> RESOURCES</div></div>
      </h2>
      <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
    </div>)
  );
}
export default MainInput;