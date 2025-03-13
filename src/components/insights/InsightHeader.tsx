import { Button } from '@/components/shared/Button'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

interface InsightHeaderProps {
  watchTitle: string
  onSendToReview: () => void
}

export function InsightHeader({ watchTitle, onSendToReview }: InsightHeaderProps) {
  return (
    <div className="flex w-1/2 justify-between">
      <Link
        href={'/endorser/dashboard/insights'}
        className="text-base no-underline flex items-center text-nowrap"
      >
        <ChevronLeftIcon className="text-white mr-4" /> Back to Insights Menu
      </Link>
      <div className="flex">
        <Button
          variant="gray_w"
          className="text-nowrap rounded-[.625rem] text-sm ml-10 outline-0 border-none min-w-[10rem]"
          label="Save Insight"
          type="submit"
          disabled={!/^(?=.{5,400}$).*/.test(watchTitle)}
        />
        <Button
          label="Send to Review"
          className="text-nowrap rounded-[.625rem] text-sm ml-5 min-w-[10rem]"
          onClick={onSendToReview}
          disabled={true}
        />
      </div>
    </div>
  )
}
