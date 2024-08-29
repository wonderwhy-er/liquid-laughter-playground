import React from 'react';
import WaterSimulation from '../components/WaterSimulation';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">2D Water Simulation Toy</h1>
      <WaterSimulation />
    </div>
  );
};

export default Index;
