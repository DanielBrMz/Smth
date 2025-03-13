'use client'
import toast from 'react-hot-toast'

export default function showToast(message: string, successMessage?: boolean): void {
  if (message) {
    if (successMessage) {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }
}
