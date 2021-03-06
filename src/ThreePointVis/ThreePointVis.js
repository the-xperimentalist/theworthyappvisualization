import * as React from 'react';
import { Canvas } from 'react-three-fiber';
import Controls from './Controls';
import InstancedPoints from './InstancedPoints';
import Effects from './Effects';

const ThreePointVis = ({ data, layout, selectedPoint, setSelectedPoint }) => {
  return (
    <Canvas camera={{ position: [0, 0, 80], far: 15000 }}>
      <Controls />
      <ambientLight color="#ffffff" intensity={0.1} />
      <hemisphereLight
        color="#ffffff"
        skyColor="#ffffbb"
        groundColor="#080820"
        intensity={1.0}
      />
      <InstancedPoints
        data={data}
        layout={layout}
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
      />
    </Canvas>
  );
};

export default ThreePointVis;
