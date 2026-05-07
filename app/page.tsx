"use client";
import dynamic from "next/dynamic";

const CyborgTracker = dynamic(() => import("@/components/CyborgTracker"), {
  ssr: false,
});

export default function Home() {
  return <CyborgTracker />;
}
