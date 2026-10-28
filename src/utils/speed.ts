import { SPEED } from "@/constants/game";

/** Keep a generation delay inside the configured range. */
export const clampSpeed = (speed: number): number => {
  if (!Number.isFinite(speed)) return SPEED.DEFAULT;
  return Math.min(SPEED.MAX, Math.max(SPEED.MIN, speed));
};

/**
 * Map a slider position onto a delay.
 * The right end of the slider is the fastest legal delay (`SPEED.MIN`), never 0.
 */
export const speedFromSlider = (sliderValue: number): number => {
  if (!Number.isFinite(sliderValue)) return SPEED.DEFAULT;
  return clampSpeed(SPEED.MIN + SPEED.MAX - sliderValue);
};

/** Inverse of `speedFromSlider` so the control stays in range. */
export const sliderFromSpeed = (speed: number): number => {
  const clamped = clampSpeed(speed);
  return SPEED.MIN + SPEED.MAX - clamped;
};
