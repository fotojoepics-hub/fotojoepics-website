import { Link } from 'wouter';
import { CameraIcon } from '../components/Brand';
import { MagneticButton } from '../components/MagneticButton';
import { Bokeh } from '../components/motion/Bokeh';

export function NotFound() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden px-4 pt-24 pb-16">
      <Bokeh density={0.8} />
      <div className="relative text-center">
        <div className="crop-marks mx-auto grid h-40 w-32 place-items-center border border-dashed border-line-strong">
          <CameraIcon className="w-10 text-brass" strokeWidth={2} />
        </div>
        <p className="eyebrow mt-10">404</p>
        <h1 className="display-lg mt-4">This frame is empty.</h1>
        <p className="lede mx-auto mt-6 max-w-md">The page you’re looking for isn’t here — but the good stuff is.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <MagneticButton href="/book">Book your date</MagneticButton>
          <Link href="/portfolio" className="link text-sm font-semibold tracking-[0.12em] uppercase">
            See the portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
