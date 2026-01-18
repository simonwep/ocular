type Browser = 'Chrome' | 'Firefox' | 'Safari' | 'Edge' | 'Opera' | 'Unknown';

export const useBrowserType = (): Browser => {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('OPR')) {
    return 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  } else if (userAgent.includes('Edge')) {
    return 'Edge';
  } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    return 'Opera';
  }

  return 'Unknown';
};
