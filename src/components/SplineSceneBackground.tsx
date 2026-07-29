import React from 'react';
import Spline from '@splinetool/react-spline';

interface SplineSceneBackgroundProps {
  scene?: string;
  className?: string;
}

export function SplineSceneBackground({
  scene = 'https://prod.spline.design/scene.spline',
  className = '',
}: SplineSceneBackgroundProps) {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}>
      <Spline
        scene={scene}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
