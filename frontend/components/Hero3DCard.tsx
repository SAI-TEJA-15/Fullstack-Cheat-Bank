import React, { useState, useRef } from 'react';

const Hero3DCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-15deg to +15deg)
    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div
      className="relative perspective-1000 w-full max-w-md mx-auto py-8 select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background ambient neon glow behind the 3D card */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-blue-600/30 rounded-3xl blur-2xl transform scale-95 pointer-events-none animate-pulse-glow"></div>

      {/* Floating 3D Badge: Left (Docker) */}
      <div
        className="hidden sm:flex absolute -left-6 top-10 items-center gap-2 bg-surface/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 z-20 transition-transform duration-300 pointer-events-none animate-float"
        style={{
          transform: isHovered
            ? `translate3d(${-rotateY * 1.5}px, ${rotateX * 1.5}px, 60px)`
            : undefined,
        }}
      >
        <i className="fa-brands fa-docker text-blue-400 text-lg"></i>
        <span className="text-xs font-semibold text-text-primary">docker run</span>
      </div>

      {/* Floating 3D Badge: Right (Git) */}
      <div
        className="hidden sm:flex absolute -right-6 bottom-12 items-center gap-2 bg-surface/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/10 z-20 transition-transform duration-300 pointer-events-none animate-float-reverse"
        style={{
          transform: isHovered
            ? `translate3d(${-rotateY * 1.8}px, ${rotateX * 1.8}px, 70px)`
            : undefined,
        }}
      >
        <i className="fa-brands fa-git-alt text-pink-400 text-lg"></i>
        <span className="text-xs font-semibold text-text-primary">git commit -m</span>
      </div>

      {/* The 3D Rotating Bank Card */}
      <div
        ref={cardRef}
        className="relative preserve-3d w-full h-64 rounded-2xl p-7 border border-white/15 shadow-2xl transition-transform duration-200 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? 'scale3d(1.03, 1.03, 1.03)' : 'scale3d(1, 1, 1)'
          }`,
          background:
            'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(88, 28, 135, 0.85) 100%)',
        }}
      >
        {/* Holographic moving shine sheen */}
        <div className="absolute inset-0 hologram-effect pointer-events-none opacity-40"></div>

        {/* Dynamic mouse glare reflection */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 220px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.25), transparent 70%)`,
            opacity: isHovered ? 1 : 0,
          }}
        ></div>

        {/* Card Header (3D Z-plane) */}
        <div
          className="flex justify-between items-start transition-transform duration-300"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <i className="fa-solid fa-book-bookmark text-white text-lg"></i>
            </div>
            <div>
              <p className="text-sm font-black tracking-wider text-white">CHEATBANK</p>
              <p className="text-[10px] tracking-widest text-purple-300 uppercase font-mono">Dev Vault Pass</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 text-purple-200 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
            VIP 3.0
          </span>
        </div>

        {/* Chip & NFC symbol (3D Z-plane) */}
        <div
          className="my-5 flex items-center justify-between transition-transform duration-300"
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-yellow-600/40 shadow-inner flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 grid grid-cols-2 border-t border-b border-yellow-700/30"></div>
            <div className="w-4 h-4 rounded-full border border-yellow-800/40"></div>
          </div>
          <i className="fa-solid fa-wifi text-white/50 text-xl transform rotate-90"></i>
        </div>

        {/* Card Number / Code Reference (3D Z-plane) */}
        <div
          className="mt-1 transition-transform duration-300"
          style={{ transform: 'translateZ(50px)' }}
        >
          <p className="font-mono text-lg tracking-[0.25em] text-white/95 font-semibold drop-shadow-md">
            4096 •••• •••• 1337
          </p>
        </div>

        {/* Card Footer: Holder & Expiry */}
        <div
          className="mt-4 flex justify-between items-end text-xs transition-transform duration-300"
          style={{ transform: 'translateZ(35px)' }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">AUTHORIZED CODER</p>
            <p className="font-semibold text-white tracking-wide">DEVELOPER PRIME</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">EXPIRES</p>
            <p className="font-mono font-semibold text-purple-200">∞</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero3DCard;

