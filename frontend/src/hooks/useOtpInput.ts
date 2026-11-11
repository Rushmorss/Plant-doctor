import { useEffect, useRef, useState } from 'react';

export function useOtpInput(length = 6, resendSeconds = 60) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const focusAt = (index: number) => refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const handleChange = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) {
      setDigits((prev) => prev.map((d, i) => i === index ? '' : d));
      return;
    }
    setDigits((prev) => {
      const next = [...prev];
      clean.
      slice(0, length - index).
      split('').
      forEach((char, offset) => {
        next[index + offset] = char;
      });
      return next;
    });
    focusAt(index + clean.length);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index]) focusAt(index - 1);
    if (e.key === 'ArrowLeft') focusAt(index - 1);
    if (e.key === 'ArrowRight') focusAt(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length }, (_, i) => pasted[i] ?? ''));
    focusAt(pasted.length);
  };

  const resend = () => {
    setDigits(Array(length).fill(''));
    setSecondsLeft(resendSeconds);
    focusAt(0);
  };

  return {
    digits,
    code: digits.join(''),
    isComplete: digits.every(Boolean),
    secondsLeft,
    refs,
    handleChange,
    handleKeyDown,
    handlePaste,
    resend
  };
}