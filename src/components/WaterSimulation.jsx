import React, { useRef, useEffect } from 'react';

const WaterSimulation = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const particlesRef = useRef([]);
  const gridRef = useRef([]);

  const WIDTH = 800;
  const HEIGHT = 600;
  const CELL_SIZE = 10;
  const PARTICLE_COUNT = 1000;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    initializeParticles();
    initializeGrid();

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const initializeParticles = () => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        vx: 0,
        vy: 0,
      });
    }
  };

  const initializeGrid = () => {
    const cols = Math.floor(WIDTH / CELL_SIZE);
    const rows = Math.floor(HEIGHT / CELL_SIZE);
    for (let i = 0; i < cols; i++) {
      gridRef.current[i] = [];
      for (let j = 0; j < rows; j++) {
        gridRef.current[i][j] = [];
      }
    }
  };

  const updateGrid = () => {
    const cols = Math.floor(WIDTH / CELL_SIZE);
    const rows = Math.floor(HEIGHT / CELL_SIZE);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        gridRef.current[i][j] = [];
      }
    }

    particlesRef.current.forEach((particle) => {
      const col = Math.floor(particle.x / CELL_SIZE);
      const row = Math.floor(particle.y / CELL_SIZE);
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        gridRef.current[col][row].push(particle);
      }
    });
  };

  const applyForces = () => {
    particlesRef.current.forEach((particle) => {
      particle.vy += 0.1; // Gravity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary conditions
      if (particle.x < 0) particle.x = 0;
      if (particle.x > WIDTH) particle.x = WIDTH;
      if (particle.y < 0) particle.y = 0;
      if (particle.y > HEIGHT) particle.y = HEIGHT;

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
    });
  };

  const resolveCollisions = () => {
    const cols = Math.floor(WIDTH / CELL_SIZE);
    const rows = Math.floor(HEIGHT / CELL_SIZE);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cell = gridRef.current[i][j];
        for (let a = 0; a < cell.length; a++) {
          for (let b = a + 1; b < cell.length; b++) {
            const pa = cell[a];
            const pb = cell[b];
            const dx = pb.x - pa.x;
            const dy = pb.y - pa.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < CELL_SIZE) {
              const nx = dx / distance;
              const ny = dy / distance;
              const relativeVelocity = (pb.vx - pa.vx) * nx + (pb.vy - pa.vy) * ny;
              const impulse = 2 * relativeVelocity / (2);
              pa.vx += impulse * nx;
              pa.vy += impulse * ny;
              pb.vx -= impulse * nx;
              pb.vy -= impulse * ny;
            }
          }
        }
      }
    }
  };

  const animate = () => {
    contextRef.current.clearRect(0, 0, WIDTH, HEIGHT);
    updateGrid();
    applyForces();
    resolveCollisions();
    drawParticles();
    requestAnimationFrame(animate);
  };

  const drawParticles = () => {
    contextRef.current.fillStyle = 'rgba(0, 100, 255, 0.8)';
    particlesRef.current.forEach((particle) => {
      contextRef.current.beginPath();
      contextRef.current.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
      contextRef.current.fill();
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-lg"
      />
    </div>
  );
};

export default WaterSimulation;