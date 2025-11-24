"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function useScrollParallax() {
  const [scrollY, setScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId = 0;

    const updateScroll = () => {
      setScrollY(container.scrollTop);
      rafId = 0;
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateScroll);
    };

    updateScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollY, scrollContainerRef };
}
