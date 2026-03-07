"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Button({
  borderRadius = "9999px",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 8000,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        // Outer shell: transparent bg, 1.5px padding = the border gap
        "relative overflow-hidden bg-transparent p-[1.5px]",
        containerClassName,
      )}
      style={{ borderRadius }}
      {...otherProps}
    >
      {/* ── Moving dot layer ── */}
      <div className="absolute inset-0" style={{ borderRadius }}>
        <MovingBorder duration={duration} rx="50%" ry="50%">
          <div
            className={cn(
              // Large white glow blob — the "border dot"
              "h-24 w-24 bg-[radial-gradient(circle,_rgba(255,255,255,1)_0%,_rgba(255,255,255,0.4)_50%,_transparent_75%)] opacity-100",
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      {/* ── Inner content — covers everything except the 1.5px gap ── */}
      {/*
        IMPORTANT: NO border class here. The "border" the user sees is
        purely the gap (p-[1.5px]) revealing the white glow behind it.
      */}
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center bg-[#05050A] text-white antialiased",
          className,
        )}
        style={{ borderRadius }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 8000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x ?? 0,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y ?? 0,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        {/*
          rx="50%" on an SVG rect makes the corners fully rounded (pill shape).
          getTotalLength() on this rect gives the exact perimeter of the pill,
          so the dot travels the correct path — no shortcuts across corners.
        */}
        <rect
          fill="none"
          stroke="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>

      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
