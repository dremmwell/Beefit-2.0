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

  let currentDate = `${day}-${month}-${year} at ${hour}:${minutes}`;
  return currentDate
}