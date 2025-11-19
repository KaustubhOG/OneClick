"use client";

import CardComponent from "@/component/card";
import LightRays from "@/components/LightRays";
import BlurText from "@/components/BlurText";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Light Rays - BEHIND everything */}
      <div className="absolute inset-0 z-0">
        <LightRays className="h-full w-full" />
      </div>

      {/* FOREGROUND CONTENT (above background) */}
      <div className="relative z-10 backdrop-blur-md bg-black/30 min-h-screen text-white">
        {/* Header */}
        <div className="flex justify-center text-purple-700 text-8xl tracking-widest py-8">
          <BlurText />
        </div>-

        <hr className="border-white/20" />

        {/* Services Section */}
        <div className="py-12">
          <div className="flex justify-center text-2xl p-4 font-medium">
            Services
          </div>

          <div className="flex justify-center gap-8 pb-10 px-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <CardComponent title="Youtube" route="/Youtube" />
                <CardComponent title="X" route="/X" />
                <CardComponent title="Tiktok" route="/Tiktok" />
              </div>
              <div className="flex flex-row gap-4">
                <CardComponent title="Youtube" route="/Youtube" />
                <CardComponent title="X" route="/X" />
                <CardComponent title="Tiktok" route="/Tiktok" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/20" />

        {/* Footer */}
        <div className="flex justify-center p-6 text-sm opacity-70">
          about the website
        </div>
      </div>
    </div>
  );
}
