export const UI_LAYOUT = {
  minTouchTarget: 72,
  compactControlHeight: 48,
  safeNavigationY: 670,
  safeFooterY: 696
} as const;

export function touchHitSize(
  width: number,
  height: number,
  minimum: number = UI_LAYOUT.minTouchTarget
): { width: number; height: number } {
  return {
    width: Math.max(width, minimum),
    height: Math.max(height, minimum)
  };
}
