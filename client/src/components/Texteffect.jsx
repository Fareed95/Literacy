"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect.tsx";

const words = `Tell us what uh wanna learn. Rest is our Responsibility 😉
`;

export function TextGenerateEffectDemo() {
  return <TextGenerateEffect words={words} />;
}
