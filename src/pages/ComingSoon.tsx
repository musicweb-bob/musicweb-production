interface ComingSoonProps {
  title: string;
  subtitle: string;
  onNavigate?: (page: string) => void;
}

export function ComingSoon({ title, subtitle, onNavigate }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-surface-base text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">

        {/* Brand Header */}
        <div className="w-full flex justify-center mt-20 mb-12">
          <h2 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-white text-center whitespace-nowrap">
            <span className="text-white">MUSIC</span>
            <span className="bg-gradient-to-r from-brand-orange to-accent-purple bg-clip-text text-transparent">web</span>
            <span className="text-white text-lg sm:text-2xl align-super">®</span>
            <span className="mx-3 text-gray-400">/</span>
            <span className="text-white">MUSIK</span>
            <span className="bg-gradient-to-r from-brand-orange to-accent-purple bg-clip-text text-transparent">web</span>
            <span className="text-white text-lg sm:text-2xl align-super">®</span>
          </h2>
        </div>

        {/* Title */}
        <h1 className="font-display text-display-lg mb-4">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-body-xl text-gray-300 mb-8">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-brand-orange to-accent-purple hover:from-brand-orange-dark hover:to-accent-purple-dark text-white font-display font-bold px-8 py-4 rounded-xl shadow-glow-orange hover:shadow-glow-purple transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-1">
            Notify Me
          </button>

          <button
            onClick={() => onNavigate && onNavigate("home")}
            className="backdrop-blur-lg bg-glass-white-10 border-2 border-glass-white-20 hover:bg-glass-white-15 hover:border-brand-orange text-white font-display font-semibold px-8 py-4 rounded-xl shadow-glass transition-all duration-300"
          >
            Go Back Home
          </button>
        </div>

      </div>
    </div>
  );
}
