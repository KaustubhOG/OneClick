"use client";

import CardComponent from "@/component/card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      {/* header layout */}
      <div className="flex justify-center text-3xl p-2">OneClick</div>
      {/* header layout */}

      <hr />

      {/* card layout */}
      <div>
        <div className="flex justify-center p-2">Services</div>
        {/* Card Section */}
        <div className="flex justify-center gap-3 pb-5">
          <CardComponent title="Youtube" route="/Youtube" />
          <CardComponent title="X" route="/X" />
          <CardComponent title="Tiktok" route="/Tiktok" />
        </div>
      </div>
      {/* card layout */}

      <hr />

      {/* footer layout */}
      <div className="flex justify-center p-2">about the website</div>
      {/* footer layout */}

    </>
  );
}
