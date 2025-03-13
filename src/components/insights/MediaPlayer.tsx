import React, { useEffect, useRef, useState } from 'react'
import { Settings, Volume2, VolumeX, Maximize, Pause, Play } from 'lucide-react'
import { useMediaStore } from '@/store/MediaStore'
import { v4 as uuidv4 } from 'uuid'

interface MediaPlayerProps {
  src: string
  mimeType: string
  qualities?: {
    label: string
    src: string
    bitrate: number
  }[]
}

export function MediaPlayer({ src, mimeType, qualities = [] }: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [selectedQuality, setSelectedQuality] = useState(qualities[0]?.label || 'auto')
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [networkQuality, setNetworkQuality] = useState<'high' | 'medium' | 'low'>('high')
  const { playingId, setPlayingId } = useMediaStore()
  const id = useRef(uuidv4()).current

  useEffect(() => {
    // Network quality detection
    interface NetworkInformation extends EventTarget {
      effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
      addEventListener: (type: 'change', callback: EventListener) => void
      removeEventListener: (type: 'change', callback: EventListener) => void
    }

    interface NavigatorWithConnection extends Navigator {
      connection?: NetworkInformation
    }

    const connection = (navigator as NavigatorWithConnection).connection
    if (connection) {
      const updateNetworkQuality = () => {
        const effectiveType = connection.effectiveType
        if (effectiveType === '4g') setNetworkQuality('high')
        else if (effectiveType === '3g') setNetworkQuality('medium')
        else setNetworkQuality('low')
      }

      connection.addEventListener('change', updateNetworkQuality)
      updateNetworkQuality()

      return () => connection.removeEventListener('change', updateNetworkQuality)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    const fullSrc = src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_SERVER_URL}${src}`

    // Select quality based on network conditions if in auto mode
    if (selectedQuality === 'auto' && qualities.length > 0) {
      const qualityMap = {
        high: qualities[0],
        medium: qualities[Math.floor(qualities.length / 2)],
        low: qualities[qualities.length - 1],
      }
      video.src = qualityMap[networkQuality]?.src || fullSrc
    } else {
      const selectedStream = qualities.find((q) => q.label === selectedQuality)
      video.src = selectedStream?.src || fullSrc
    }

    const handleError = (e: Event) => {
      console.error('Video error:', (e as ErrorEvent).message)
      const videoEl = e.target as HTMLVideoElement
      if (videoEl.error) {
        console.error('Video error details:', {
          code: videoEl.error.code,
          message: videoEl.error.message,
        })
      }
    }

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('error', handleError)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('error', handleError)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, mimeType, selectedQuality, networkQuality])

  useEffect(() => {
    if (playingId !== id && isPlaying) {
      videoRef.current?.pause()
    }
  }, [playingId, id, isPlaying])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        setPlayingId(id)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted)
      videoRef.current.muted = !isMuted
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!src) {
    return (
      <div className="w-full h-32 bg-black rounded-lg flex items-center justify-center text-gray-500">
        No media available
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-auto rounded-lg bg-black"
        playsInline
        onClick={togglePlay}
      />

      {/* Custom HUD */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          style={{
            background: `linear-gradient(to right, #7849de ${(currentTime / duration) * 100}%, #4B5563 ${(currentTime / duration) * 100}%)`,
          }}
          className="w-full h-1 mb-4 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause button */}
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Volume control */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="text-white hover:text-gray-300">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(to right, #7849de ${volume * 100}%, #4B5563 ${volume * 100}%)`,
                }}
                className="w-20 h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white"
              />
            </div>

            {/* Time display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quality selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="text-white hover:text-gray-300"
              >
                <Settings size={24} />
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2">
                  <div className="text-white text-sm mb-2">Quality</div>
                  {['auto', ...qualities.map((q) => q.label)].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => {
                        setSelectedQuality(quality)
                        setShowQualityMenu(false)
                      }}
                      className={`block w-full text-left px-4 py-1 text-sm ${
                        selectedQuality === quality ? 'text-blue-400' : 'text-white'
                      } hover:bg-white/10 rounded`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen button */}
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              <Maximize size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
