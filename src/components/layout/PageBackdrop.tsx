export default function PageBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute -top-[10%] -left-[10%] h-[60vw] w-[60vw] rounded-full bg-[#155f75b5] opacity-40 blur-[130px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-[#9a341299] opacity-30 mix-blend-screen blur-[130px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,#000000_100%)]" />
    </div>
  );
}
