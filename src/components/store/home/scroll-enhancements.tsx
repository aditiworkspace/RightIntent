"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollEnhancements() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setShowScrollTop(window.scrollY > 380);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // IntersectionObserver for sleek scroll-reveals
    const revealElements = document.querySelectorAll(".scroll-reveal, .stagger-children");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Scroll Reading Progress Bar - fixed right below announcement / header */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-[2.5px] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--terra)] via-[#d78353] to-[var(--ink)] transition-all duration-150 ease-out shadow-[0_1px_4px_rgba(187,98,73,0.3)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Back-To-Top Circular Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-[60] w-10 h-10 rounded-full bg-[var(--ink)] text-[var(--paper)] border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto hover:bg-[var(--terra)] hover:scale-105 active:scale-95"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
