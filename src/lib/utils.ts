import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getCurrentDate(){
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1; //Months are 0 based index (0-11)
  let year = date.getFullYear();
  let hour = date.getHours();
  let minutes = date.getMinutes();

  let currentDate = `${day}-${month}-${year}`;
  return currentDate
}

// Helper function to determine text color based on background color
export function getContrastColor(hexColor: string): string {
  // Remove the # if it exists
  const color = hexColor.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(color.substring(0, 2), 16)
  const g = Number.parseInt(color.substring(2, 4), 16)
  const b = Number.parseInt(color.substring(4, 6), 16)

  // Calculate luminance - human perception of brightness
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Return black for bright colors, white for dark colors
  return luminance > 0.7 ? "#000000" : "#ffffff"
}
