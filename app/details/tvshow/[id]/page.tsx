"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Play, X, Star, Share2 } from "lucide-react";
import Footer from "@/src/components/layout/Footer";
import DetailsSkeleton from "@/src/components/skeletons/DetailsSkeleton";
import MediaCard from "@/src/components/media/MediaCard";
import { useTVShowDetails } from "@/src/hooks/details/useTVShowDetails";
import { formatRuntime, formatDate } from "@/src/lib/utils/format";
import { extractColors } from "@/src/lib/utils/color";
import { useEffect, useState } from "react";

export default function TVShowDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    tvShow,
    loading,
    error,
    showTrailer,
    setShowTrailer,
    similarShows,
  } = useTVShowDetails(id);

  const [gradientColors, setGradientColors] = useState<string[]>([]);

  useEffect(() => {
    if (tvShow?.backdrop_path) {
      extractColors(tvShow.backdrop_path, 0.15).then(setGradientColors);
    }
  }, [tvShow?.backdrop_path]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0718]">
        <div className="text-red-500 text-2xl">
          {error || "TV Show not found"}
        </div>
      </div>
    );
  }

  // Format date to just year
  const releaseYear = tvShow.first_air_date
    ? new Date(tvShow.first_air_date).getFullYear()
    : "N/A";

  return (
    <div
      className="text-white font-body-md overflow-x-hidden antialiased min-h-screen relative"
      style={{
        backgroundColor: "#0b0718",
        backgroundImage: gradientColors.length > 0 ? `
          radial-gradient(circle at 0% 0%, ${gradientColors[0]} 0%, transparent 50%),
          radial-gradient(circle at 100% 0%, ${gradientColors[1]} 0%, transparent 50%),
          radial-gradient(circle at 0% 100%, ${gradientColors[2]} 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, ${gradientColors[3]} 0%, transparent 50%)
        ` : undefined,
        backgroundAttachment: "fixed",
      }}
    >
      {showTrailer && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95">
          <div className="relative w-[90%] max-w-[1200px] aspect-video">
            <button
              className="absolute -top-12 right-0 z-[2001] text-white hover:text-red-500 transition"
              onClick={() => setShowTrailer(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="TV Show Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Hero Background Image */}
      <div
        className="fixed inset-0 z-0 h-[70vh] w-full overflow-hidden pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%)'
        }}
      >
        {tvShow.backdrop_path ? (
          <Image
            src={tvShow.backdrop_path}
            alt={tvShow.name}
            fill
            className="w-full h-full object-cover object-center opacity-60 mix-blend-screen"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1d26] opacity-60 mix-blend-screen" />
        )}
      </div>

      <div className="relative px-4 md:px-16 lg:px-24 z-10 w-full pt-50 md:pt-55 flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left Column: Poster & Actions */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 shrink-0">
          {/* Poster Card */}
          <div
            className="rounded-[2rem] aspect-[2/3] mx-4 md:mx-0 overflow-hidden relative group"
            style={{
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.1),0 20px 40px rgba(0,0,0,0.4)",
            }}
          >
            {tvShow.poster_path ? (
              <Image
                src={tvShow.poster_path}
                alt={tvShow.name}
                fill
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/*Tagline*/}
          {
            tvShow.tagline && (
              <span className="text-center text-white/80 text-sm italic"> "{tvShow.tagline}"</span>
            )
          }

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2">
            <button
              onClick={() => router.push(`/watch/tvshow/${tvShow.id}?season=1&episode=1`)}
              className="apple-glass col-span-2 border-none rounded-full py-3 px-4 flex items-center justify-center gap-2 text-white font-medium text-sm transition-all hover:brightness-110 active:scale-95"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Episode 1
            </button>
            <button
              onClick={() => setShowTrailer(true)}
              className="apple-glass col-span-2 border-none rounded-full py-3 px-4 flex items-center justify-center gap-2 text-white/80 hover:text-white font-medium text-sm transition-all hover:bg-white/10 active:scale-95"
            >
              <Play className="w-5 h-5" />
              Trailer
            </button>
            <button className="apple-glass col-span-1 border-none rounded-full py-3 px-4 flex items-center justify-center gap-2 text-white/80 hover:text-white font-medium text-sm transition-all hover:bg-white/10 active:scale-95">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full flex flex-col justify-start">
          {/* Title Area */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight tracking-tight">
              {tvShow.name}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 text-white/70 text-base">
              <span className="flex items-center gap-1.5 text-orange-400 font-medium">
                <Star className="w-5 h-5" fill="currentColor" />
                {tvShow.vote_average?.toFixed(1) || "N/A"}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{releaseYear}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>
                {tvShow.number_of_seasons || tvShow.seasons?.filter(s => s.season_number > 0).length || 0} Season{(tvShow.number_of_seasons || tvShow.seasons?.filter(s => s.season_number > 0).length) !== 1 ? "s" : ""}
              </span>
              {tvShow.maturityRating && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="bg-white/5 backdrop-blur-[10px] border border-white/5 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {tvShow.maturityRating}
                  </span>
                </>
              )}
              {!tvShow.maturityRating && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-bold">
                    18+
                  </span>
                </>
              )}
              {tvShow.is_anime && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="bg-[#E8470A]/20 text-[#E8470A] border border-[#E8470A]/20 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    Anime
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-3 mb-10">
            {tvShow.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-white/10 backdrop-blur-[20px] px-4 py-2 rounded-full font-medium text-sm text-white/80"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="apple-glass rounded-[2rem] p-4 mb-8 w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-4">
              Synopsis
            </h3>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              {tvShow.overview || "No overview available."}
            </p>
          </div>

          {/* Cast & Details Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left Column: Top Cast */}
            <div className="apple-glass rounded-[2rem] p-2 flex flex-col">
              <div
                className="flex justify-between items-center rounded-[2rem] px-4 py-2"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.1),0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                <h3 className="text-xl md:text-2xl font-semibold text-white/90">
                  Top Cast
                </h3>
                <button className="text-sm text-white/50 hover:text-white transition-colors flex items-center">
                  See All <span className="ml-1 text-xs">&gt;</span>
                </button>
              </div>

              {tvShow.casts?.length > 0 ? (
                <div className="flex p-2 pt-4 md:p-4 flex-col gap-4">
                  {tvShow.casts.slice(0, 4).map((person, index) => (
                    <div
                      key={`${person.character}-${person.original_name}-${index}`}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-white/10 relative shrink-0">
                        {person.profile_path ? (
                          <Image
                            src={person.profile_path}
                            alt={person.original_name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-base">
                          {person.original_name}
                        </span>
                        <span className="text-white/50 text-sm">
                          {person.character}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 p-4">No cast information available.</p>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="apple-glass rounded-[2rem] p-2 flex flex-col">
              <h3
                className="px-4 py-2 rounded-[2rem] text-xl md:text-2xl font-semibold text-white/90 mb-6"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.1),0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                Details
              </h3>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4 px-2 md:px-4 mb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Created By</span>
                  <span className="text-white text-base">
                    {tvShow.created_by && tvShow.created_by.length > 0
                      ? tvShow.created_by.map((c) => c.original_name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Network</span>
                  <span className="text-white text-base">
                    {tvShow.networks && tvShow.networks.length > 0
                      ? tvShow.networks.map((n) => n.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">First Air Date</span>
                  <span className="text-white text-base">
                    {tvShow.first_air_date
                      ? formatDate(tvShow.first_air_date)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Status</span>
                  <span className="text-white text-base">
                    {tvShow.status || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-white/50 text-sm">Production</span>
                  <span className="text-white text-base">
                    {tvShow.production_companies?.length > 0
                      ? tvShow.production_companies.map((c) => c.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                <span className="text-white/50 text-sm px-2 md:px-4">Language</span>
                <div className="flex flex-wrap gap-2 px-2 md:px-4">
                  <span className="bg-white/5 backdrop-blur-[10px] border border-white/10 px-3 py-1.5 rounded-full text-sm text-white/80">
                    {tvShow.original_language
                      ? tvShow.original_language.toUpperCase()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasons Section */}
      {tvShow.seasons && tvShow.seasons.length > 0 && (
        <div className="px-4 md:px-16 lg:px-24 ">
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90 px-2">
            Seasons
          </h2>
          <div className="flex gap-6 overflow-x-auto pt-4 pb-12 scrollbar-hide -mx-8 md:-mx-16 lg:-mx-24 px-8 md:px-16 lg:px-24">
            {tvShow.seasons
              .filter((season) => season.season_number > 0)
              .map((season) => (
                <div
                  key={season.season_number}
                  className="apple-glass rounded-[2rem] overflow-hidden flex flex-shrink-0 w-[300px] md:w-[350px] gap-4 p-2 transition hover:bg-white/5 cursor-pointer"
                >
                  <div className="relative w-24 h-36 rounded-[1.5rem] overflow-hidden flex-shrink-0">
                    {season.poster_path ? (
                      <Image
                        src={season.poster_path}
                        alt={season.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                        No Poster
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center py-2 pr-4 min-w-0">
                    <h4 className="text-white font-bold text-lg mb-1 truncate">
                      {season.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-white/50 mb-2">
                      <span>
                        {season.air_date
                          ? new Date(season.air_date).getFullYear()
                          : "N/A"}
                      </span>
                      <span>•</span>
                      <span>{season.episode_count} Episodes</span>
                    </div>
                    {season.overview && (
                      <p className="text-white/40 text-xs line-clamp-3 leading-relaxed">
                        {season.overview}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Similar Shows */}
      {similarShows.length > 0 && (
        <div className="px-4 md:px-16 lg:px-24 pb-4 md:pb-16">
          <h3 className="text-2xl md:text-3xl font-semibold text-white/90 mb-6">
            More Like This
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarShows.slice(0, 6).map((item) => (
              <MediaCard
                key={item.tmdbId}
                item={item}
                onClick={() => router.push(`/details/tvshow/${item.tmdbId}`)}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
