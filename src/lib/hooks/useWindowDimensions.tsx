import { useState, useEffect } from 'react';

function getWindowDimensions() {

  if (typeof window === 'undefined') {
    return { width: undefined, height: undefined };
 }
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}


export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
 
  useEffect(() => {
     // Function to handle window resize
     function handleResize() {
       setWindowDimensions(getWindowDimensions());
     }
 
     // Only add the event listener if we're in the browser
     if (typeof window !== 'undefined') {
       window.addEventListener('resize', handleResize);
     }
 
     // Cleanup function to remove the event listener
     return () => {
       if (typeof window !== 'undefined') {
         window.removeEventListener('resize', handleResize);
       }
     };
  }, []);
 
  return windowDimensions;
 }