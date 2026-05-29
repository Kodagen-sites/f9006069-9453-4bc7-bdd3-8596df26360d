"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export interface HeroChapter {
  at: number;           // scroll progress threshold (0–1) when this chapter activates
  eyebrow?: string;
  headlineLines: string[];
  subline?: string;
  cta?: { label: string; href: string };
}

interface Props {
  progress: number;
  chapters: HeroChapter[];
  position?: "bottom-left" | "center" | "bottom-right";
  textColor?: string;
  accentColor?: string;
  accentTextColor?: string;
  showChapterDots?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroScrollText({
  progress,
  chapters,
  position = "bottom-left",
  textColor = "var(--color-cream, #f5ede1)",
  accentColor = "var(--color-terracotta, #c4623a)",
  accentTextColor = "var(--color-cream, #f5ede1)",
  showChapterDots = true,
}: Props) {
  let activeIdx = 0;
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (progress >= chapters[i].at) { activeIdx = i; break; }
  }
  const chapter = chapters[activeIdx];

  const wrapClass =
    position === "center"
      ? "absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      : position === "bottom-right"
      ? "absolute inset-x-0 bottom-0 flex flex-col items-end px-6 pb-16 md:pb-20"
      : "absolute inset-x-0 bottom-0 flex flex-col px-6 pb-16 md:pb-20";

  const innerClass =
    position === "center" ? "w-full max-w-4xl mx-auto" : "w-full max-w-7xl mx-auto";

  return (
    <div className={wrapClass}>
      <div className={innerClass}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            {chapter.eyebrow && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.05, ease } }}
                className="block text-[11px] uppercase tracking-[0.25em]"
                style={{ color: accentColor }}
              >
                {chapter.eyebrow}
              </motion.span>
            )}

            <h1 className="mt-6 font-display" style={{ color: textColor }}>
              {chapter.headlineLines.map((line, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, delay: 0.1 + i * 0.16, ease },
                  }}
                  className="block leading-[0.95] tracking-[-0.025em]"
                  style={{
                    fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
                    fontWeight: i === 0 ? 400 : 300,
                    fontStyle: i === 1 ? "italic" : "normal",
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {chapter.subline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.42 } }}
                className="mt-6 max-w-xl text-lg md:text-xl"
                style={{ color: `color-mix(in srgb, ${textColor} 70%, transparent)` }}
              >
                {chapter.subline}
              </motion.p>
            )}

            {chapter.cta && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.58, ease } }}
                className="mt-8"
              >
                <Link
                  href={chapter.cta.href}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-opacity hover:opacity-85"
                  style={{ background: accentColor, color: accentTextColor }}
                >
                  {chapter.cta.label}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {showChapterDots && chapters.length > 1 && (
          <div className="mt-10 flex items-center gap-2">
            {chapters.map((_, i) => (
              <div
                key={i}
                className="h-px rounded-full transition-all duration-500 ease-out"
                style={{
                  width: i === activeIdx ? 28 : 10,
                  opacity: i <= activeIdx ? 0.55 : 0.2,
                  background: textColor,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
