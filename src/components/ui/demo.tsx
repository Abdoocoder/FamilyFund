import { SplineScene } from './splite';
import { Card } from './card';
import { Spotlight } from './spotlight';

export function SplineSceneDemo() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="flex h-full relative z-10">
        <div className="flex-1 p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">مرحباً بك</h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            منصة إدارة صندوق الجمعية — تتبع subscriptions، إدارة المدفوعات، ومراقبة التبرعات
          </p>
        </div>
        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/scene.spline"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
