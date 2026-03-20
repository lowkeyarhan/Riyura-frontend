"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Play, Bookmark, X } from "lucide-react";
import Footer from "@/src/components/layout/Footer";
import DetailsSkeleton from "@/src/components/skeletons/DetailsSkeleton";
import { InfoRow } from "@/src/components/ui/InfoRow";
import MediaCard from "@/src/components/media/MediaCard";
import { useMovieDetails } from "@/src/hooks/details/useMovieDetails";
import { formatRuntime, formatDate, formatMoney } from "@/src/lib/utils/format";

const BG_COLOR = "rgb(7, 9, 16)";
const FONT = "Be Vietnam Pro, sans-serif";

export default function MovieDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    movie,
    loading,
    error,
    isWatchlisted,
    showTrailer,
    setShowTrailer,
    toggleWatchlist,
    similarMovies,
  } = useMovieDetails(id);

  if (loading) {
    return (
      <div className="min-h-screen">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black" />
          <div className="hidden md:block">
            <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f7575] blur-[130px] opacity-40" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341264] blur-[130px] opacity-30 mix-blend-screen" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
        </div>
        <div className="relative z-10">
          <DetailsSkeleton />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG_COLOR }}
      >
        <div className="text-red-500 text-2xl">
          {error || "Movie not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />

        {/* Mobile Background */}
        <div className="block md:hidden">
          {/* <div className="absolute -top-[10%] -left-[10%] w-[160vw] h-[160vw] rounded-full bg-[#155f75b5] blur-[120px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[160vw] h-[160vw] rounded-full bg-[#9a341299] blur-[120px] opacity-30 mix-blend-screen" /> */}
        </div>

        {/* Desktop Background */}
        <div className="hidden md:block">
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f7575] blur-[130px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341264] blur-[130px] opacity-30 mix-blend-screen" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>
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

      {/* HERO CONTENT */}
      <div className="relative z-10 h-[70vh] min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          }}
        >
          {movie.backdrop_path ? (
            <Image
              src={movie.backdrop_path}
              alt={movie.title}
              fill
              className="object-cover brightness-50"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#1a1d26]" />
          )}
        </div>
        <div className="relative h-full flex flex-col justify-end px-4 md:px-16 lg:px-20 md:pb-12">
          <div className="max-w-3xl">
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
              style={{ fontFamily: FONT }}
            >
              {movie.title}
            </h1>
            {movie.tagline && (
              <p
                className="text-base md:text-lg text-gray-300 italic mb-6"
                style={{ fontFamily: FONT }}
              >
                {movie.tagline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white rounded-full transition font-semibold text-sm md:text-base whitespace-nowrap"
                style={{ fontFamily: FONT }}
              >
                <Play className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                Trailer
              </button>
              <button
                onClick={() => router.push(`/watch/movie/${movie.id}`)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#3a404f60] hover:bg-white/20 text-white rounded-full transition font-semibold text-sm md:text-base whitespace-nowrap"
                style={{ fontFamily: FONT }}
              >
                <Play className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                Movie
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleWatchlist}
                  className={`p-3 rounded-full transition ${
                    isWatchlisted
                      ? "bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Bookmark
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill={isWatchlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 md:px-16 py-8 md:py-16 space-y-8">
        <section className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-4 bg-[#3a404f60] md:bg-[#1518215f] border border-white/5 rounded-2xl">
              <h2
                className="text-2xl md:text-4xl font-semibold text-white mb-4 md:mb-6"
                style={{ fontFamily: FONT }}
              >
                Overview
              </h2>
              <p
                className="text-white/70 leading-relaxed text-sm md:text-base"
                style={{ fontFamily: FONT }}
              >
                {movie.overview}
              </p>
            </div>
            <div className="p-4 bg-[#3a404f60] md:bg-[#1518215f] border border-white/5 rounded-2xl space-y-4">
              {movie.is_anime && (
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium bg-cyan-500/30 text-cyan-300"
                    style={{ fontFamily: FONT }}
                  >
                    Anime
                  </span>
                </div>
              )}
              <InfoRow
                label="Release Date"
                value={
                  movie.release_date ? formatDate(movie.release_date) : "N/A"
                }
              />
              <InfoRow
                label="Runtime"
                value={movie.runtime > 0 ? formatRuntime(movie.runtime) : "N/A"}
              />
              <InfoRow
                label="IMDb Rating"
                value={movie.vote_average?.toFixed(1) || "N/A"}
              />
              {movie.original_language && (
                <InfoRow
                  label="Original Language"
                  value={movie.original_language.toUpperCase()}
                />
              )}
              {movie.status && <InfoRow label="Status" value={movie.status} />}
              {movie.production_companies?.length > 0 && (
                <InfoRow
                  label="Production"
                  value={movie.production_companies
                    .slice(0, 2)
                    .map((c) => c.name)
                    .join(", ")}
                />
              )}
              {movie.budget > 0 && (
                <InfoRow label="Budget" value={formatMoney(movie.budget)} />
              )}
              {movie.revenue > 0 && (
                <InfoRow label="Revenue" value={formatMoney(movie.revenue)} />
              )}
              <div className="flex items-center justify-between">
                <span className="text-white/60" style={{ fontFamily: FONT }}>
                  Genres
                </span>
                <div className="flex gap-2 flex-wrap justify-end">
                  {movie.genres?.slice(0, 3).map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full px-3 py-1 text-xs font-medium bg-white/15"
                      style={{ fontFamily: FONT }}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-4 bg-[#3a404f60] md:bg-[#1518215f] border border-white/5 rounded-2xl">
          <h2
            className="text-2xl md:text-4xl font-semibold text-white mb-6"
            style={{ fontFamily: FONT }}
          >
            Cast
          </h2>
          {movie.casts?.length ? (
            <>
              {/* Mobile View: Vertical List */}
              <div className="md:hidden space-y-4">
                {movie.casts.slice(0, 12).map((person, index) => (
                  <div
                    key={`${person.character}-${person.original_name}-${index}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      {person.profile_path ? (
                        <Image
                          src={person.profile_path}
                          alt={person.original_name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </div>
                    <div>
                      <p
                        className="text-white font-semibold"
                        style={{ fontFamily: FONT }}
                      >
                        {person.original_name}
                      </p>
                      <p
                        className="text-white/60 text-sm"
                        style={{ fontFamily: FONT }}
                      >
                        {person.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Horizontal Scroll */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide -mx-4 px-4">
                <div className="flex gap-6">
                  {movie.casts.slice(0, 12).map((person, index) => (
                    <div
                      key={`${person.character}-${person.original_name}-${index}`}
                      className="flex-shrink-0 w-[180px]"
                    >
                      <div className="relative aspect-[2/3] rounded-t-xl overflow-hidden">
                        {person.profile_path ? (
                          <Image
                            src={person.profile_path}
                            alt={person.original_name}
                            fill
                            sizes="180px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 bg-[#1a1a1a] rounded-b-2xl p-4">
                        <p
                          className="text-white text-base font-semibold truncate"
                          style={{ fontFamily: FONT }}
                        >
                          {person.original_name}
                        </p>
                        <p
                          className="text-white/60 text-sm truncate"
                          style={{ fontFamily: FONT }}
                        >
                          {person.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-white/50" style={{ fontFamily: FONT }}>
              No cast information available.
            </p>
          )}
        </section>
        {similarMovies.length > 0 && (
          <section>
            <h2
              className="text-2xl md:text-4xl font-semibold text-white mb-6"
              style={{ fontFamily: FONT }}
            >
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((item) => (
                <MediaCard
                  key={item.tmdbId}
                  item={item}
                  onClick={() => router.push(`/details/movie/${item.tmdbId}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
