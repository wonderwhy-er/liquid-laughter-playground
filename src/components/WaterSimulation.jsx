import React, { useRef, useEffect, useState } from 'react';

const WaterSimulation = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [waves, setWaves] = useState([]);
  const [debugMessages, setDebugMessages] = useState([]);

  const WIDTH = 800;
  const HEIGHT = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    const handleInteraction = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
      addWave(x, y);
      addDebugMessage(`Interaction at (${x.toFixed(2)}, ${y.toFixed(2)})`);
    };

    canvas.addEventListener('mousedown', handleInteraction);
    canvas.addEventListener('touchstart', handleInteraction);
    canvas.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) handleInteraction(e);
    });
    canvas.addEventListener('touchmove', handleInteraction);

    const animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleInteraction);
      canvas.removeEventListener('touchstart', handleInteraction);
      canvas.removeEventListener('mousemove', handleInteraction);
      canvas.removeEventListener('touchmove', handleInteraction);
    };
  }, []);

  const addDebugMessage = (message) => {
    setDebugMessages(prev => [...prev.slice(-4), message]);
  };

  const addWave = (x, y) => {
    const newWave = {
      x,
      y,
      radius: 0,
      maxRadius: Math.random() * 150 + 100, // Increased max radius
      speed: Math.random() * 3 + 2, // Increased speed
      opacity: 1,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`, // Random blue-green color
    };
    setWaves(prevWaves => [...prevWaves, newWave]);
    addDebugMessage(`Wave added at (${x.toFixed(2)}, ${y.toFixed(2)})`);
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
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = wave.opacity;
        ctx.stroke();
        ctx.globalAlpha = 1;

        return wave.radius < wave.maxRadius ? wave : null;
      }).filter(Boolean)
    );

    // Draw debug messages
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    debugMessages.forEach((msg, index) => {
      ctx.fillText(msg, 10, 30 + index * 25);
    });

    // Draw wave count
    ctx.fillStyle = 'yellow';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Active Waves: ${waves.length}`, 10, HEIGHT - 20);

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <canvas
        ref={canvasRef}
        className="border border-blue-300 shadow-lg rounded-lg cursor-pointer"
      />
    </div>
  );
};

export default WaterSimulation;
