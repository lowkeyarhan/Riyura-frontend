interface SearchHeroProps {
  show: boolean;
}

const FONT_STYLE = { fontFamily: "Be Vietnam Pro, sans-serif" };

export function SearchHero({ show }: SearchHeroProps) {
  if (!show) return null;

  return (
    <div className="text-center mb-16 max-w-5xl mx-auto">
      <h1
        className="text-4xl lg:text-6xl font-bold mb-6 text-white tracking-wide"
        style={{
          fontFamily: "MMontserrat, sans-serif",
          letterSpacing: "0.02em",
        }}
      >
        To find it later, just search for it.
      </h1>
      <p
        className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 400 }}
      >
        Search by keyword, brand, type, date, color – whatever you think of
        first. Discover millions of movies and shows instantly.
      </p>
    </div>
  );
}
