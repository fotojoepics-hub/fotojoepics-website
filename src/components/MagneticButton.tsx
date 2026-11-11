// Adapted from "Magnetic Button" on 21st.dev
// (Hirael, MIT · Mohammad Shehadeh · https://github.com/MohammadShehadeh/hirael).
// Restyled to the FotoJoe gold pill; spring timing kept under ~300ms.
import { m, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { Link } from 'wouter';
import { cn } from '../lib/motion';
import { ArrowIcon } from './Brand';

const SPRING = { stiffness: 220, damping: 16, mass: 0.12 };

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  size?: 'md' | 'sm';
  external?: boolean;
  'data-intro-item'?: boolean;
  onClick?: () => void;
};

export function MagneticButton({ href, children, className, strength = 0.35, size = 'md', external, onClick, ...rest }: Props) {
  const reduced = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span className="btn-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="btn-dot" aria-hidden="true">
        <ArrowIcon />
      </span>
    </>
  );
  const props = {
    className: cn('btn', size === 'sm' && 'btn-sm', className),
    style: { x, y },
    onPointerMove,
    onPointerLeave: reset,
    onClick,
    ...rest,
  };

  if (external) {
    return (
      <m.a href={href} {...props}>
        {inner}
      </m.a>
    );
  }
  return (
    <Link href={href} asChild>
      <m.a {...props}>{inner}</m.a>
    </Link>
  );
}
