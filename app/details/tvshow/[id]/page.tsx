"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Play, Bookmark, X } from "lucide-react";
import Footer from "@/src/components/layout/Footer";
import DetailsSkeleton from "@/src/components/skeletons/DetailsSkeleton";
import { InfoRow } from "@/src/components/ui/InfoRow";
import MediaCard from "@/src/components/media/MediaCard";
import { useTVShowDetails } from "@/src/hooks/details/useTVShowDetails";
import { formatRuntime, formatDate } from "@/src/lib/utils/format";

const BG_COLOR = "rgb(7, 9, 16)";
const FONT = "Be Vietnam Pro, sans-serif";

export default function TVShowDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    tvShow,
    loading,
    error,
    isWatchlisted,
    showTrailer,
    setShowTrailer,
    toggleWatchlist,
    similarShows,
  } = useTVShowDetails(id);

  if (loading) {
    return (
      <div className="min-h-screen relative">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-black" />
          <div className="hidden md:block">
            <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
        </div>
        <div className="relative z-10">
          <DetailsSkeleton />
        </div>
      </div>
    );
  }

  if (error || !tvShow) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG_COLOR }}
      >
        <div className="text-red-500 text-2xl">
          {error || "TV Show not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />

        {/* Mobile Background */}
        <div className="block md:hidden">
          {/* <div className="absolute -top-[10%] -left-[10%] w-[160vw] h-[160vw] rounded-full bg-[#155f75b5] blur-[120px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[160vw] h-[160vw] rounded-full bg-[#9a341299] blur-[120px] opacity-30 mix-blend-screen" /> */}
        </div>

        {/* Desktop Background */}
        <div className="hidden md:block">
          <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#155f75b5] blur-[130px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#9a341299] blur-[130px] opacity-30 mix-blend-screen" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
      </div>

      {/* Trailer Modal */}
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
              src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`}
              title="TV Show Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Hero Banner */}
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
          {tvShow.backdrop_path ? (
            <Image
              src={tvShow.backdrop_path}
              alt={tvShow.name}
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
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 text-white"
              style={{ fontFamily: FONT }}
            >
              {tvShow.name}
            </h1>
            {tvShow.tagline && (
              <p
                className="text-base md:text-lg text-gray-300 italic mb-6"
                style={{ fontFamily: FONT }}
              >
                {tvShow.tagline}
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
                onClick={() =>
                  router.push(`/watch/tvshow/${tvShow.id}?season=1&episode=1`)
                }
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#3a404f60] hover:bg-white/20 text-white rounded-full transition font-semibold text-sm md:text-base whitespace-nowrap"
                style={{ fontFamily: FONT }}
              >
                <Play className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                Episode 1
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

      {/* Content Sections */}
      <div className="relative z-10 px-4 md:px-16 py-8 md:py-16 space-y-8">
        {/* Overview */}
        <section className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-4 bg-gradient-to-br from-white/10 to-white/[0.02] md:bg-[#1518215f] md:border md:border-white/5 rounded-2xl">
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
                {tvShow.overview}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-white/10 to-white/[0.02] md:bg-[#1518215f] md:border md:border-white/5 rounded-2xl space-y-4">
              {tvShow.is_anime && (
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
                label="First Air Date"
                value={
                  tvShow.first_air_date
                    ? formatDate(tvShow.first_air_date)
                    : "N/A"
                }
              />
              {tvShow.runtime > 0 && (
                <InfoRow
                  label="Episode Runtime"
                  value={formatRuntime(tvShow.runtime)}
                />
              )}
              <InfoRow
                label="IMDb Rating"
                value={tvShow.vote_average?.toFixed(1) || "N/A"}
              />
              {tvShow.original_language && (
                <InfoRow
                  label="Original Language"
                  value={tvShow.original_language.toUpperCase()}
                />
              )}
              {tvShow.status && (
                <InfoRow label="Status" value={tvShow.status} />
              )}
              {tvShow.origin_country?.length > 0 && (
                <InfoRow
                  label="Origin"
                  value={tvShow.origin_country.join(", ")}
                />
              )}
              <InfoRow
                label="Network"
                value={
                  tvShow.networks?.[0]?.name ||
                  tvShow.production_companies?.[0]?.name ||
                  "Unknown"
                }
              />

              {tvShow.production_companies &&
                tvShow.production_companies.length > 0 && (
                  <InfoRow
                    label="Production"
                    value={tvShow.production_companies
                      .slice(0, 2)
                      .map((c) => c.name)
                      .join(", ")}
                  />
                )}

              {tvShow.created_by && tvShow.created_by.length > 0 && (
                <InfoRow
                  label="Created By"
                  value={tvShow.created_by.map((c) => c.name).join(", ")}
                />
              )}

              <div className="flex items-center justify-between">
                <span className="text-white/60" style={{ fontFamily: FONT }}>
                  Genres
                </span>
                <div className="flex gap-2 flex-wrap justify-end">
                  {tvShow.genres?.slice(0, 3).map((genre) => (
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

        {/* Cast Section */}
        <section className="p-4 bg-gradient-to-br from-white/10 to-white/[0.02] md:bg-[#1518215f] md:border md:border-white/5 rounded-2xl">
          <h2
            className="text-2xl md:text-4xl font-semibold text-white mb-6"
            style={{ fontFamily: FONT }}
          >
            Cast
          </h2>
          {tvShow.casts?.length ? (
            <>
              {/* Mobile View: Vertical List */}
              <div className="md:hidden space-y-4">
                {tvShow.casts.slice(0, 12).map((person, index) => (
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
                  {tvShow.casts.slice(0, 12).map((person, index) => (
                    <div
                      key={`${person.character}-${person.original_name}-${index}`}
                      className="group cursor-pointer flex-shrink-0 w-[180px]"
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

        {/* Seasons Section */}
        {tvShow.seasons && tvShow.seasons.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-2xl md:text-4xl font-semibold mb-6 md:mb-8 text-white"
              style={{ fontFamily: FONT }}
            >
              Seasons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tvShow.seasons
                .filter((season) => season.season_number > 0)
                .map((season) => (
                  <div
                    key={season.season_number}
                    className="flex gap-4 bg-gradient-to-br from-white/10 to-white/[0.02] rounded-2xl overflow-hidden transition cursor-pointer group"
                  >
                    <div className="relative w-28 h-40 flex-shrink-0">
                      {season.poster_path ? (
                        <Image
                          src={season.poster_path}
                          alt={season.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs text-center p-2">
                          No Poster
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <h3
                        className="text-lg font-semibold text-white mb-2"
                        style={{ fontFamily: FONT }}
                      >
                        {season.name}
                      </h3>
                      <div
                        className="flex items-center gap-3 text-sm text-gray-400"
                        style={{ fontFamily: FONT }}
                      >
                        {season.air_date && (
                          <span>{new Date(season.air_date).getFullYear()}</span>
                        )}
                        <span>•</span>
                        <span>
                          {season.episode_count} Episode
                          {season.episode_count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {season.overview && (
                        <p
                          className="text-white/60 text-sm leading-relaxed mt-2 line-clamp-3"
                          style={{ fontFamily: FONT }}
                        >
                          {season.overview}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {similarShows.length > 0 && (
          <section>
            <h2
              className="text-2xl md:text-4xl font-semibold text-white mb-6"
              style={{ fontFamily: FONT }}
            >
              More Like This
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarShows.map((item) => (
                <MediaCard
                  key={item.tmdbId}
                  item={item}
                  onClick={() => router.push(`/details/tvshow/${item.tmdbId}`)}
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
