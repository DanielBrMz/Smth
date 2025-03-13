import { create } from 'zustand'

interface MediaStore {
  playingId: string | null
  setPlayingId: (id: string | null) => void
}

export const useMediaStore = create<MediaStore>((set) => ({
  playingId: null,
  setPlayingId: (id) => set({ playingId: id }),
}))
