'use client'

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react"

export default function Preloader({ isReady }: { isReady: boolean }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90 && !isReady) return 90;

        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }

        const increment = 1 + Math.floor((100 - prev) / 10);
        return Math.min(prev + increment, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isReady]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 flex flex-col items-center justify-center z-9999 bg-background"
          initial={{ opacity: 1 }}
          exit={{
            transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
            filter: "blur(20px)",
            opacity: 0
          }}
        >
          <motion.div className="flex justify-center items-center gap-4 mb-20">
            <div className="w-62.5 h-auto">
              <Image
                src="/img/logo/surtio.svg"
                alt="Surtio Logo"
                className="w-full h-auto block dark:hidden"
                width={200}
                height={150}
              />
              <Image
                src="/img/logo/surtio-dark.svg"
                alt="Surtio Surtio Logo"
                className="w-full h-auto hidden dark:block"
                width={200}
                height={150}
              />
            </div>
          </motion.div>
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-4 tabular-nums font-mono text-muted-foreground">
            {progress}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}