import React from 'react';
import WaterSimulation from '../components/WaterSimulation';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 text-blue-300">Top-Down Wave Simulation</h1>
      <WaterSimulation />
    </div>
  );
};

export default Index;
