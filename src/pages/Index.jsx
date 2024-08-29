import React from 'react';
import WaterSimulation from '../components/WaterSimulation';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <h1 className="text-4xl font-bold mb-4 text-blue-300">Top-Down Water Simulation</h1>
      <p className="text-blue-100 mb-4">Touch or click to create waves</p>
      <WaterSimulation />
    </div>
  );
};

export default Index;
