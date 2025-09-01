export const normalizeUrlSegment = (segment) => 
  segment?.toLowerCase().trim().replace(/\s+/g, '-') || '';

export const generateCacheKey = (prefix, ...args) => 
  `${prefix}-${args.map(arg => normalizeUrlSegment(arg)).join('-')}`;