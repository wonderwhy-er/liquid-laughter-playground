import React, { useRef, useEffect, useState } from 'react';

const WaterSimulation = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [waves, setWaves] = useState([]);

  const WIDTH = 800;
  const HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    const handleTouch = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
      addWave(x, y);
    };

    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  const addWave = (x, y) => {
    setWaves(prevWaves => [
      ...prevWaves,
      {
        x,
        y,
        radius: 0,
        maxRadius: Math.random() * 100 + 50,
        speed: Math.random() * 2 + 1,
        opacity: 1
      }
    ]);
  };

  const animate = () => {
    const ctx = contextRef.current;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw background
    const gradient = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 0, WIDTH/2, HEIGHT/2, Math.max(WIDTH, HEIGHT)/2);
    gradient.addColorStop(0, '#0077BE');
    gradient.addColorStop(1, '#005691');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Update and draw waves
    setWaves(prevWaves => 
      prevWaves.map(wave => {
        wave.radius += wave.speed;
        wave.opacity = 1 - (wave.radius / wave.maxRadius);

        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        return wave.radius < wave.maxRadius ? wave : null;
      }).filter(Boolean)
    );

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        className="border border-blue-300 shadow-lg rounded-lg"
      />
    </div>
  );
};

export default WaterSimulation;
