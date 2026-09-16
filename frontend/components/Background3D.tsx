import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const colors = ['#818cf8', '#a855f7', '#ec4899', '#38bdf8'];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * 800 + 200,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const fov = 400;

    const render = () => {
      // Smooth mouse interpolation (lerp)
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const tiltX = (mouseY - height / 2) * 0.0003;
      const tiltY = (mouseX - width / 2) * 0.0003;

      ctx.clearRect(0, 0, width, height);

      // Radial ambient lighting that follows mouse gently
      const gradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        50,
        mouseX,
        mouseY,
        width * 0.8
      );
      gradient.addColorStop(0, 'rgba(109, 40, 217, 0.12)');
      gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const projected: { x: number; y: number; scale: number; p: Particle }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around bounds
        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 100) p.z = 1000;
        if (p.z > 1000) p.z = 100;

        // Apply 3D perspective with tilt
        const cosX = Math.cos(tiltX);
        const sinX = Math.sin(tiltX);
        const cosY = Math.cos(tiltY);
        const sinY = Math.sin(tiltY);

        // Rotate Y
        let rx = p.x * cosY + p.z * sinY;
        let rz = -p.x * sinY + p.z * cosY;

        // Rotate X
        let ry = p.y * cosX - rz * sinX;
        rz = p.y * sinX + rz * cosX;

        if (rz > 0) {
          const scale = fov / (fov + rz);
          const screenX = width / 2 + rx * scale;
          const screenY = height / 2 + ry * scale;

          projected.push({ x: screenX, y: screenY, scale, p });

          // Draw particle
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.radius * scale * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(Math.max(scale * 0.8, 0.1), 0.7);
          ctx.shadowBlur = 10 * scale;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw constellation connections between nearby 3D points
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.18 * projected[i].scale;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = '#a78bfa';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.8 * projected[i].scale;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ background: 'transparent' }}
    />
  );
};

export default Background3D;
