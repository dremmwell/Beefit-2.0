import { useState, useEffect } from "react"

export default function useRefDimensions(ref: React.RefObject<HTMLDivElement>) {
  const [dimensions, setDimensions] = useState({ width: 1, height: 2 });

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const boundingRect = ref.current.getBoundingClientRect();
        setDimensions({
          width: Math.round(boundingRect.width),
          height: Math.round(boundingRect.height)
        });
      }
    };

    // Only run once on mount
    updateDimensions();

    // Add event listener only once
    window.addEventListener('resize', updateDimensions);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []); // Empty dependency array

  return dimensions;
}