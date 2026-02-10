import React from "react";
import Banner from "@/src/components/media/Banner";
import HomeClient from "./HomeClient";
import Footer from "@/src/components/layout/Footer";

// Server-side data fetching
async function getInitialData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const [moviesRes, tvRes, animeRes, bannerRes] = await Promise.all([
      fetch(`${baseUrl}/api/movies`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/trending-tv`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/trending-anime`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/banner`, { cache: "no-store" }),
    ]);

    const [movies, tvShows, anime, bannerData] = await Promise.all([
      moviesRes.ok ? moviesRes.json() : { results: [] },
      tvRes.ok ? tvRes.json() : { results: [] },
      animeRes.ok ? animeRes.json() : { results: [] },
      bannerRes.ok ? bannerRes.json() : { items: [] },
    ]);

    return { movies, tvShows, anime, bannerData };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return {
      movies: { results: [] },
      tvShows: { results: [] },
      anime: { results: [] },
      bannerData: { items: [] },
    };
  }
}

export default async function HomePage() {
  const initialData = await getInitialData();

  return (
    <div className="min-h-screen bg-black">
      <Banner initialItems={initialData.bannerData.items} />
      <HomeClient initialData={initialData} />
      <Footer />
    </div>
  );
}
