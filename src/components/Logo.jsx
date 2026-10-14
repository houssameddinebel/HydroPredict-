import React from 'react';
import { Sprout } from 'lucide-react';

// Brand mark: sprout in an emerald gradient tile.
export default function Logo({ size = 30 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-lg shadow-emerald-900/40 shrink-0"
      style={{ width: size, height: size }}
    >
      <Sprout color="#fff" size={size * 0.62} />
    </span>
  );
}
