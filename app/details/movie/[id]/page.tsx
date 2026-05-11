"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Play, X, Star } from "lucide-react";
import Footer from "@/src/components/layout/Footer";
import DetailsSkeleton from "@/src/components/skeletons/DetailsSkeleton";
import MediaCard from "@/src/components/media/MediaCard";
import { useMovieDetails } from "@/src/hooks/details/useMovieDetails";
import { formatRuntime, formatDate, formatMoney } from "@/src/lib/utils/format";

export default function MovieDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { movie, loading, error, showTrailer, setShowTrailer, similarMovies } =
    useMovieDetails(id);

  if (loading) {
    return (
      <div className="min-h-screen">
        <DetailsSkeleton />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0718]">
        <div className="text-red-500 text-2xl">
          {error || "Movie not found"}
        </div>
      </div>
    );
  }

  // Format date to just year
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div
      className="text-white font-body-md overflow-x-hidden antialiased min-h-screen relative"
      style={{
        backgroundColor: "#0b0718",
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(232, 71, 10, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, rgba(57, 144, 255, 0.05) 0%, transparent 50%)
        `,
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
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0 h-[70vh] w-full">
        {movie.backdrop_path ? (
          <Image
            src={movie.backdrop_path}
            alt={movie.title}
            fill
            className="w-full h-full object-cover object-center opacity-60 mix-blend-screen"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-[#1a1d26] opacity-60 mix-blend-screen" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0718] via-[#0b0718]/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 pt-55 pb-24 flex flex-col md:flex-row gap-10 md:gap-16">
        {/* Left Column: Poster & Actions */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 shrink-0">
          {/* Poster Card */}
          <div className="apple-glass rounded-xl aspect-[2/3] overflow-hidden relative group">
            {movie.poster_path ? (
              <Image
                src={movie.poster_path}
                alt={movie.title}
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

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push(`/watch/movie/${movie.id}`)}
              className="bg-[#E8470A] shadow-[0_10px_30px_rgba(232,71,10,0.3),inset_0_1px_0_rgba(255,255,255,0.3)] border-none rounded-full py-3 px-4 flex items-center justify-center gap-2 text-white font-medium text-sm w-full transition-all hover:brightness-110 active:scale-95"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Play Movie
            </button>
            <button
              onClick={() => setShowTrailer(true)}
              className="bg-white/5 backdrop-blur-[20px] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] rounded-full py-3 px-4 flex items-center justify-center gap-2 text-white/80 hover:text-white font-medium text-sm transition-all hover:bg-white/10 active:scale-95 w-full"
            >
              <Play className="w-5 h-5" />
              Trailer
            </button>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full flex flex-col justify-start">
          {/* Title Area */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight tracking-tight">
              {movie.title}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-2 text-white/70 text-base">
              <span className="flex items-center gap-1.5 text-orange-400 font-medium">
                <Star className="w-5 h-5" fill="currentColor" />
                {movie.vote_average?.toFixed(1) || "N/A"}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{releaseYear}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>
                {movie.runtime > 0 ? formatRuntime(movie.runtime) : "N/A"}
              </span>
              {movie.maturityRating && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="bg-white/5 backdrop-blur-[10px] border border-white/5 px-2 py-0.5 rounded text-xs font-bold uppercase">
                    {movie.maturityRating}
                  </span>
                </>
              )}
              {!movie.maturityRating && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className="bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-xs font-bold">
                    18+
                  </span>
                </>
              )}
              {movie.is_anime && (
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
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="bg-white/10 backdrop-blur-[20px] px-4 py-2 rounded-full font-medium text-sm text-white/80"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Synopsis */}
          <div className="apple-glass rounded-[2rem] p-6 mb-8 w-full">
            <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-4">
              Synopsis
            </h3>
            <p className="text-base md:text-lg text-white/70 leading-relaxed">
              {movie.overview || "No overview available."}
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
                <h3 className="text-2xl font-semibold text-white/90">
                  Top Cast
                </h3>
                <button className="text-sm text-white/50 hover:text-white transition-colors flex items-center">
                  See All <span className="ml-1 text-xs">&gt;</span>
                </button>
              </div>

              {movie.casts?.length > 0 ? (
                <div className="flex p-4 flex-col gap-4">
                  {movie.casts.slice(0, 4).map((person, index) => (
                    <div
                      key={`${person.character}-${person.original_name}-${index}`}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 relative shrink-0">
                        {person.profile_path ? (
                          <Image
                            src={person.profile_path}
                            alt={person.original_name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-base group-hover:text-orange-400 transition-colors">
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
                <p className="text-white/50">No cast information available.</p>
              )}
            </div>

            {/* Right Column: Details */}
            <div className="apple-glass rounded-[2rem] p-2 flex flex-col">
              <h3
                className="px-4 py-2 rounded-[2rem] text-2xl font-semibold text-white/90 mb-6"
                style={{
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.1),0 20px 40px rgba(0,0,0,0.4)",
                }}
              >
                Details
              </h3>

              <div className="grid grid-cols-2 gap-y-4 gap-x-4 px-4 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Director</span>
                  <span className="text-white text-base">
                    {movie.directors && movie.directors.length > 0
                      ? movie.directors.map((d) => d.original_name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Writers</span>
                  <span className="text-white text-base">
                    {movie.writers && movie.writers.length > 0
                      ? movie.writers.map((w) => w.original_name).join(", ")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Release Date</span>
                  <span className="text-white text-base">
                    {movie.release_date
                      ? formatDate(movie.release_date)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">Budget</span>
                  <span className="text-white text-base">
                    {movie.budget > 0 ? formatMoney(movie.budget) : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-white/50 text-sm">Studios</span>
                  <span className="text-white text-base">
                    {movie.production_companies?.length > 0
                      ? movie.production_companies.map((c) => c.name).join(", ")
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-white/50 text-sm px-4">Language</span>
                <div className="flex flex-wrap gap-2 px-4">
                  <span className="bg-white/5 backdrop-blur-[10px] border border-white/10 px-3 py-1.5 rounded-full text-sm text-white/80">
                    {movie.original_language
                      ? movie.original_language.toUpperCase()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-6">
                More Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {similarMovies.slice(0, 5).map((item) => (
                  <MediaCard
                    key={item.tmdbId}
                    item={item}
                    onClick={() => router.push(`/details/movie/${item.tmdbId}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
