import { cn } from '../../lib/cn'
import { rerunsLabel, videosLabel } from '../../lib/format'

export interface VideoMeterProps {
  videos: { used: number; total: number }
  reruns: { used: number; total: number }
}

/**
 * Twee potten naast elkaar: hoeveel uitlegvideo's je nog mag maken, en hoe
 * vaak je er nog een opnieuw kunt laten draaien. Die tweede is gezamenlijk,
 * niet per video.
 */
export function VideoMeter({ videos, reruns }: VideoMeterProps) {
  const videosOver = Math.max(0, videos.total - videos.used)
  const rerunsOver = Math.max(0, reruns.total - reruns.used)

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="flex items-center gap-2 text-body-sm">
        <span className={cn(videosOver <= 2 ? 'text-orange-shade' : 'text-gray-2')}>
          {videosLabel(videos.used, videos.total)}
        </span>
        <span className="text-gray-4" aria-hidden>·</span>
        <span className={cn(rerunsOver <= 1 ? 'text-orange-shade' : 'text-gray-3')}>
          {rerunsLabel(reruns.used, reruns.total)}
        </span>
      </span>
      <span className="h-1.5 w-40 overflow-hidden rounded-pill bg-gray-5">
        <span
          className={cn(
            'block h-full rounded-pill transition-[width] duration-500',
            videosOver <= 2 ? 'bg-orange' : 'bg-blue',
          )}
          style={{ width: `${(videosOver / videos.total) * 100}%` }}
        />
      </span>
    </div>
  )
}
