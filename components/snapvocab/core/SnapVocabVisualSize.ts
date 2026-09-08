export type SnapVocabVisualSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export const SIZE_MAP: Record<Exclude<SnapVocabVisualSize, number>, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
  xl: 96,
};

export function resolveVisualSize(size: SnapVocabVisualSize = 'md'): number {
  if (typeof size === 'number') {
    return size;
  }
  return SIZE_MAP[size] || SIZE_MAP.md;
}
