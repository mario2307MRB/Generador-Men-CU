
import React from 'react';

const ForkKnifeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 21V3l4 4" />
    <path d="M15 21V3l4 4" />
    <path d="M3 3h18" />
    <path d="M5 12h14" />
  </svg>
);

export default ForkKnifeIcon;
