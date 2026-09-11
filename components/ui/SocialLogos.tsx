import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function GoogleLogo({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Blue segment */}
      <Path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      {/* Green segment */}
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      {/* Yellow segment */}
      <Path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      {/* Red segment */}
      <Path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </Svg>
  );
}

export function FacebookLogo({ 
  size = 22, 
  variant = 'badge',
  badgeColor = '#FFFFFF',
  iconColor = '#0866FF'
}: { 
  size?: number; 
  variant?: 'badge' | 'plain';
  badgeColor?: string;
  iconColor?: string;
}) {
  if (variant === 'badge') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Crisp circular badge */}
        <Circle cx="12" cy="12" r="12" fill={badgeColor} />
        {/* Official Meta Facebook 'f' */}
        <Path
          fill={iconColor}
          d="M15.117 8.002h-1.637c-.368 0-.48.174-.48.497v1.543h2.117l-.28 2.195h-1.837V18h-2.58v-5.763H9.25v-2.195h1.17V8.502c0-1.688.988-2.61 2.541-2.61.744 0 1.385.055 1.57.08v2.03z"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={iconColor}
        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.52-.14-2.71-.14-2.73 0-4.79 1.66-4.79 4.9v2.6H7.5v4H10V22h4v-8.5z"
      />
    </Svg>
  );
}
