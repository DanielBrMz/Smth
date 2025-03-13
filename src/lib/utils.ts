import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatTimeRemaining(seconds: number) {
  if (!seconds || seconds === Infinity) return '--'
  if (seconds < 60) {
    return `${Math.ceil(seconds)} seconds`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.ceil(seconds % 60)
  return `${minutes} min ${remainingSeconds} sec`
}

export function generateStreamUrl(filename: string) {
  return `/api/contents/proxy-stream/${encodeURIComponent(filename)}`
}
