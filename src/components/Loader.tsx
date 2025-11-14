"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/contexts/LoadingContext";

export default function Loader() {
  const { isLoading: contextLoading } = useLoading();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleDOMReady = () => {
      timeoutId = setTimeout(() => {
        setIsInitialLoading(false);
      }, 200);
    };

    if (typeof document !== "undefined") {
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        handleDOMReady();
      } else {
        document.addEventListener("DOMContentLoaded", handleDOMReady);
      }
    } else {
      timeoutId = setTimeout(() => setIsInitialLoading(false), 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (typeof document !== "undefined") {
        document.removeEventListener("DOMContentLoaded", handleDOMReady);
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const shouldShowLoader = isInitialLoading || contextLoading;

    if (typeof document !== "undefined") {
      if (shouldShowLoader) {
        document.documentElement.style.backgroundColor = "white";
        document.body.style.backgroundColor = "white";
        document.body.style.overflow = "hidden";
      } else {
        document.documentElement.style.backgroundColor = "";
        document.body.style.backgroundColor = "";
        document.body.style.overflow = "";
      }
    }

    return () => {
      if (typeof document !== "undefined") {
        document.documentElement.style.backgroundColor = "";
        document.body.style.backgroundColor = "";
        document.body.style.overflow = "";
      }
    };
  }, [mounted, isInitialLoading, contextLoading]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const shouldShowLoader = isInitialLoading || contextLoading;

  return (
    <AnimatePresence mode="wait">
      {shouldShowLoader && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/logo.png"
                alt="Integrated Value Solutions"
                width={240}
                height={80}
                priority
                quality={90}
                className="w-auto h-16 sm:h-20 md:h-24"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
