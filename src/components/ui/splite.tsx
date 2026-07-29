import React from 'react';
import Spline from '@splinetool/react-spline';
import { cn } from '../../lib/utils';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

const SplineScene = ({ scene, className }: SplineSceneProps) => {
  return (
    <div className={cn('relative w-full h-full', className)}>
      <Spline scene={scene} />
    </div>
  );
};

export { SplineScene };
