"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>name</div>
      <div>this is border</div>

      <div>
        <div>headline</div>

        {/* Card Section */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* YouTube Card */}
          <Link href="/Youtube">
            <div
              style={{
                padding: "20px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              YouTube
            </div>
          </Link>

          {/* TikTok Card */}
          <Link href="/Tiktok">
            <div
              style={{
                padding: "20px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              TikTok
            </div>
          </Link>

          {/* X Card */}
          <Link href="/X">
            <div
              style={{
                padding: "20px",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              X
            </div>
          </Link>
        </div>
      </div>

      <div>about the website</div>
    </>
  );
}
