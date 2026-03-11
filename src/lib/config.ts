const getImageBaseUrl = () =>
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

// Config for image URLs
export const imageConfig = {
  original: `${getImageBaseUrl()}/original`,
  w780: `${getImageBaseUrl()}/w780`,
  w500: `${getImageBaseUrl()}/w500`,
};
