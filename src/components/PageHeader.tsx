import type { ReactNode } from 'react';
import { Bokeh } from './motion/Bokeh';
import { SplitHeading } from './motion/SplitHeading';

export function PageHeader({ eyebrow, title, children, id }: { eyebrow: string; title: ReactNode; children?: ReactNode; id: string }) {
  return (
    <header className="relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
      <Bokeh density={0.7} intensity={0.8} />
      <div className="wrap relative">
        <p className="eyebrow mb-6">{eyebrow}</p>
        <SplitHeading as="h1" id={id} play="load" className="display-xl max-w-5xl">
          {title}
        </SplitHeading>
        {children ? <div className="lede mt-8 max-w-2xl">{children}</div> : null}
      </div>
    </header>
  );
}
