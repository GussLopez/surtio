"use client";

import { useEffect, useRef } from "react";

interface AnimatedOrangeRaysProps {
  className?: string;
}

const TOP_LINE_COUNT = 25;
const BOTTOM_LINE_COUNT = 22;

export default function AnimatedOrangeRays({
  className = "",
}: AnimatedOrangeRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!context) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const getColors = () => {
      const styles = getComputedStyle(canvas);

      return {
        primary:
          styles.getPropertyValue("--primary").trim() || "#f54900",
        light:
          styles.getPropertyValue("--primary-light").trim() || "#ff6900",
        soft:
          styles.getPropertyValue("--ray-orange-soft").trim() || "#ffb085",
      };
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      // Limitarlo a 2 evita un consumo excesivo en pantallas 3x o 4x.
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawTopFan = (
      time: number,
      colors: ReturnType<typeof getColors>,
    ) => {
      const originX = width * 0.565;
      const originY = height * 0.515;

      for (let index = 0; index < TOP_LINE_COUNT; index++) {
        const progress = index / (TOP_LINE_COUNT - 1);

        /*
         * Cada línea tiene un desfase diferente.
         * Esto evita que todas se muevan exactamente igual.
         */
        const phase = time * 0.00032 + index * 0.19;

        const movementA = Math.sin(phase) * height * 0.008;
        const movementB = Math.cos(phase * 0.82 + 1.1) * height * 0.012;
        const movementC = Math.sin(phase * 0.68 + 2.2) * height * 0.009;

        const startX = originX + progress * width * 0.025;
        const startY =
          originY -
          progress * height * 0.025 +
          movementA * 0.3;

        const control1X = width * (0.67 + progress * 0.025);
        const control1Y =
          height * (0.46 - progress * 0.09) +
          movementA;

        const control2X = width * (0.79 + progress * 0.04);
        const control2Y =
          height * (0.12 + progress * 0.29) +
          movementB;

        const endX = width * 1.04;
        const endY =
          height * (0.035 + progress * 0.285) +
          movementC;

        const gradient = context.createLinearGradient(
          startX,
          startY,
          endX,
          endY,
        );

        gradient.addColorStop(0, toRgba(colors.soft, 0));
        gradient.addColorStop(0.08, toRgba(colors.soft, 0.28));
        gradient.addColorStop(0.42, toRgba(colors.light, 0.9));
        gradient.addColorStop(0.76, toRgba(colors.primary, 0.72));
        gradient.addColorStop(1, toRgba(colors.primary, 0));

        const centerStrength =
          1 - Math.abs(progress - 0.5) * 1.25;

        context.beginPath();
        context.moveTo(startX, startY);

        context.bezierCurveTo(
          control1X,
          control1Y,
          control2X,
          control2Y,
          endX,
          endY,
        );

        context.strokeStyle = gradient;
        context.lineWidth = index % 7 === 0 ? 1.25 : 0.82;
        context.globalAlpha = 0.4 + centerStrength * 0.48;
        context.lineCap = "round";
        context.stroke();
      }
    };

    const drawBottomFan = (
      time: number,
      colors: ReturnType<typeof getColors>,
    ) => {
      const destinationX = width * 0.455;
      const destinationY = height * 0.785;

      for (let index = 0; index < BOTTOM_LINE_COUNT; index++) {
        const progress = index / (BOTTOM_LINE_COUNT - 1);
        const phase = time * 0.00028 + index * 0.17;

        const movementA = Math.sin(phase + 0.8) * height * 0.008;
        const movementB = Math.cos(phase * 0.75 + 1.7) * height * 0.011;
        const movementC = Math.sin(phase * 0.6) * height * 0.006;

        const startX = -width * 0.04;
        const startY =
          height * (0.98 - progress * 0.235) +
          movementA;

        const control1X = width * (0.17 + progress * 0.025);
        const control1Y =
          height * (0.94 - progress * 0.18) +
          movementB;

        const control2X = width * (0.33 + progress * 0.035);
        const control2Y =
          height * (0.82 - progress * 0.09) +
          movementA;

        const endX =
          destinationX +
          progress * width * 0.03 +
          movementC;

        const endY =
          destinationY -
          progress * height * 0.04 +
          movementC;

        const gradient = context.createLinearGradient(
          startX,
          startY,
          endX,
          endY,
        );

        gradient.addColorStop(0, toRgba(colors.soft, 0));
        gradient.addColorStop(0.15, toRgba(colors.soft, 0.24));
        gradient.addColorStop(0.52, toRgba(colors.light, 0.78));
        gradient.addColorStop(0.85, toRgba(colors.primary, 0.82));
        gradient.addColorStop(1, toRgba(colors.primary, 0));

        const centerStrength =
          1 - Math.abs(progress - 0.5) * 1.25;

        context.beginPath();
        context.moveTo(startX, startY);

        context.bezierCurveTo(
          control1X,
          control1Y,
          control2X,
          control2Y,
          endX,
          endY,
        );

        context.strokeStyle = gradient;
        context.lineWidth = index % 7 === 0 ? 1.2 : 0.8;
        context.globalAlpha = 0.36 + centerStrength * 0.5;
        context.lineCap = "round";
        context.stroke();
      }
    };

    const drawGlow = (
      colors: ReturnType<typeof getColors>,
    ) => {
      context.save();

      context.globalAlpha = 0.11;
      context.filter = "blur(45px)";

      const gradient = context.createRadialGradient(
        width * 0.68,
        height * 0.55,
        0,
        width * 0.68,
        height * 0.55,
        width * 0.4,
      );

      gradient.addColorStop(0, toRgba(colors.light, 0.48));
      gradient.addColorStop(0.55, toRgba(colors.soft, 0.18));
      gradient.addColorStop(1, toRgba(colors.soft, 0));

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.restore();
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);

      const colors = getColors();

      drawGlow(colors);
      drawTopFan(time, colors);
      drawBottomFan(time, colors);

      context.globalAlpha = 1;
      context.filter = "none";

      if (!reduceMotion.matches) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();

      if (reduceMotion.matches) {
        render(0);
      }
    });

    resizeObserver.observe(canvas);

    if (reduceMotion.matches) {
      render(0);
    } else {
      animationFrame = requestAnimationFrame(render);
    }

    const handleMotionChange = () => {
      cancelAnimationFrame(animationFrame);

      if (reduceMotion.matches) {
        render(0);
      } else {
        animationFrame = requestAnimationFrame(render);
      }
    };

    reduceMotion.addEventListener("change", handleMotionChange);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      reduceMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute inset-0 z-0
        block size-full
        ${className}
      `}
    />
  );
}

function toRgba(color: string, alpha: number): string {
  const normalizedColor = color.trim();

  const shortHexMatch = normalizedColor.match(
    /^#([a-f\d])([a-f\d])([a-f\d])$/i,
  );

  if (shortHexMatch) {
    const [, red, green, blue] = shortHexMatch;

    return `rgba(
      ${parseInt(red + red, 16)},
      ${parseInt(green + green, 16)},
      ${parseInt(blue + blue, 16)},
      ${alpha}
    )`;
  }

  const hexMatch = normalizedColor.match(
    /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
  );

  if (hexMatch) {
    const [, red, green, blue] = hexMatch;

    return `rgba(
      ${parseInt(red, 16)},
      ${parseInt(green, 16)},
      ${parseInt(blue, 16)},
      ${alpha}
    )`;
  }

  return normalizedColor;
}