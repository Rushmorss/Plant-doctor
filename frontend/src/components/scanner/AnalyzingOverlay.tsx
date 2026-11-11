import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { VIEWFINDER_FRAME } from './ViewfinderGuide';

export function AnalyzingOverlay() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className={`${VIEWFINDER_FRAME} overflow-hidden border-2 border-secondary`}
        style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }}>
        
        {!reduceMotion &&
        <motion.div
          className="absolute inset-x-0 h-[3px] bg-secondary"
          initial={{ top: '0%' }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} />

        }
      </div>
    </div>);

}