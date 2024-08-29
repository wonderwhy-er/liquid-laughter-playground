import React, { useRef, useEffect } from 'react';

const WaterSimulation = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const waveDataRef = useRef([]);

  const WIDTH = 800;
  const HEIGHT = 600;
  const WAVE_COUNT = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    initializeWaves();

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const initializeWaves = () => {
    for (let i = 0; i < WAVE_COUNT; i++) {
      waveDataRef.current.push({
        amplitude: Math.random() * 20 + 10,
        wavelength: Math.random() * 200 + 100,
        speed: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }
  };

  const calculateWaveHeight = (x, time) => {
    let height = 0;
    waveDataRef.current.forEach(wave => {
      height += wave.amplitude * Math.sin((2 * Math.PI / wave.wavelength) * (x - wave.speed * time) + wave.phase);
    });
    return height;
  };

  const animate = (time) => {
    contextRef.current.clearRect(0, 0, WIDTH, HEIGHT);
    drawWaves(time);
    requestAnimationFrame(animate);
  };

  const drawWaves = (time) => {
    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT / 2);

    for (let x = 0; x < WIDTH; x++) {
      const y = HEIGHT / 2 + calculateWaveHeight(x, time);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(WIDTH, HEIGHT);
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, 'rgba(0, 119, 190, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 87, 145, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
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
