"use client";

import CardComponent from "@/component/card";
import LightRays from "@/components/LightRays";

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
        <div className="flex justify-center text-3xl p-4 font-semibold">
          OneClick
        </div>

        <hr className="border-white/20" />

        {/* Services Section */}
        <div>
          <div className="flex justify-center text-xl p-4 font-medium">
            Services
          </div>

          <div className="flex justify-center gap-5 pb-10">
            <CardComponent title="Youtube" route="/Youtube" />
            <CardComponent title="X" route="/X" />
            <CardComponent title="Tiktok" route="/Tiktok" />
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