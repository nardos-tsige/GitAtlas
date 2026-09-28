import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
  cursor?: boolean;
}

export function Typewriter({
  text,
  speed = 40,
  startDelay = 0,
  className = "",
  cursor = true,
}: TypewriterProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown("");
    setDone(false);

    if (!text) return;

    let index = 0;
    let interval: number | undefined;

    const startTimer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1;
        setShown(text.slice(0, index));

        if (index >= text.length) {
          if (interval) window.clearInterval(interval);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      if (interval) window.clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      {shown}
      {cursor && (
        <span className={`inline-block ml-0.5 ${done ? "animate-cursor" : ""}`}>
          _
        </span>
      )}
    </span>
  );
}