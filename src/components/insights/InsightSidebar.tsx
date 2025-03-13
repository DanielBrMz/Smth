import Image from 'next/image'
import Select from '@/components/shared/Select'
import { ContentType, Insight, InsightFormData } from '@/types'
import { contentTypeTestData } from '@/constants/positions'
import { UseFormSetValue } from 'react-hook-form'

// Extend the form type to include optional contents
type InsightFormDataWithContents = InsightFormData & {
  contents?: number | null
}

interface InsightSidebarProps {
  contentType: ContentType | null
  setContentType: (contentType: ContentType | null) => void
  setValue: UseFormSetValue<InsightFormDataWithContents>
  insight: Insight | null
  isNew: boolean
}

export function InsightSidebar({
  contentType,
  setContentType,
  setValue,
  insight,
  isNew,
}: InsightSidebarProps) {
  return (
    <div className="flex w-1/2 gap-6">
      <div className="w-1/2 max-w-[17rem]">
        <Select
          placeholder="Choose a Mapping"
          selectedOption={contentType}
          setSelectedOption={(option) => {
            setContentType(option)
            setValue('insight_location', option?.label || 'Welcome Video')
          }}
          options={contentTypeTestData}
        />
        {contentType && (
          <Image
            src={contentType.value}
            className="mt-5"
            style={{ boxShadow: '4px 4px 30px 0 #7849de' }}
            alt="content type"
            width={500}
            height={300}
          />
        )}
      </div>

      {!isNew && insight && <StatusHistory insight={insight} />}
    </div>
  )
}

function StatusHistory({ insight }: { insight: Insight }) {
  return (
    <div className="w-1/2 max-w-[17rem] bg-[#080828] h-fit px-6 py-8">
      <h6 className="pb-4 m-0" style={{ borderBottom: '1px solid #809fb8' }}>
        Status History
      </h6>
      <div className="mt-5">
        <div className="flex justify-between text-sm mt-4">
          <span>Status</span>
          <span>{insight.state}</span>
        </div>
        <div className="flex justify-between text-sm mt-4">
          <span>Created</span>
          <span className="text-[#809fb8]">{new Date(insight.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-4">
          <span>Endorser ID</span>
          <span className="text-[#809fb8]">{insight.createdBy.id}</span>
        </div>
        <div className="flex justify-between text-sm mt-4">
          <span>Last Updated</span>
          <span className="text-[#809fb8]">{new Date(insight.updatedAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mt-4">
          <span>Comments</span>
          <span>{insight.review_commentary}</span>
        </div>
      </div>
    </div>
  )
}

export default InsightSidebar
