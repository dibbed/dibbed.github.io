import { motion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
  className?: string;
  staggerDelay?: number;
}

const charContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const charVariant = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" as const } },
};

export function TypewriterText({ text, className = "", staggerDelay = 0.05 }: TypewriterTextProps) {
  return (
    <motion.span
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: staggerDelay } },
      }}
      className={`inline-flex flex-wrap justify-center ${className}`}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={charVariant}
          className={char === " " ? "inline-block w-[0.3em]" : "inline-block"}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        variants={charVariant}
        className="inline-block animate-blink-cursor text-primary ml-0.5"
      >
        |
      </motion.span>
    </motion.span>
  );
}
