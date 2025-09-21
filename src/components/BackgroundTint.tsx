'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '@/hooks/useQuizStore';
import { getBackgroundColor } from '@/utils/colorUtils';

export default function BackgroundTint() {
  const { getCurrentColorTint } = useQuizStore();
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    const colorTint = getCurrentColorTint();
    const newBackgroundColor = getBackgroundColor(colorTint);
    setBackgroundColor(newBackgroundColor);
  }, [getCurrentColorTint]);

  return (
    <motion.div
      className="fixed inset-0 -z-10"
      animate={{ backgroundColor }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
  );
}

