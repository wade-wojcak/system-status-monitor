import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges multiple class names into a single class name.
 * Utilizes the clsx and tailwind-merge libraries for merging the class names.
 *
 * @param {...ClassValue} inputs - The class names to be merged.
 * @returns {string} - The merged class name.
 */
export function MergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
