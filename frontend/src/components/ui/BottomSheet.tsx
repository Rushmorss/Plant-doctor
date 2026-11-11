import React, { useEffect, useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const EASE = [0.32, 0.72, 0, 1] as const;

/** Bottom Sheet trên mobile, Modal căn giữa từ tablet trở lên. */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children
}: BottomSheetProps) {
  const titleId = useId();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const hidden = isDesktop ? { opacity: 0, scale: 0.96 } : { y: '100%' };
  const shown = isDesktop ? { opacity: 1, scale: 1 } : { y: 0 };

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.div
          className="absolute inset-0 bg-ink/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={onClose}
          aria-hidden="true" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={`relative flex max-h-[92dvh] w-full min-w-0 flex-col overflow-hidden rounded-t-[28px] bg-surface shadow-lift md:rounded-3xl ${
          size === 'lg' ? 'md:max-w-2xl' : 'md:max-w-md'}`
          }
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={{ duration: reduceMotion ? 0 : 0.26, ease: EASE }}>
          
            <div className="shrink-0 px-5 pb-3 pt-3 md:px-6 md:pt-5">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line md:hidden" aria-hidden="true" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 id={titleId} className="text-lg font-bold text-ink">
                    {title}
                  </h2>
                  {description && <p className="mt-1 text-sm text-muted">{description}</p>}
                </div>
                <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="-mr-2 -mt-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
            className="min-w-0 overflow-y-auto overscroll-contain px-5 md:px-6"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
            
              {children}
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}