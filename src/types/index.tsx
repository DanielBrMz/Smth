import { SerializedLexicalNode } from 'lexical'

export interface RichTextNode {
  type: string
  format: 'left' | 'center' | 'right' | 'justify'
  indent: number
  version: number
  children: SerializedLexicalNode[]
  direction: 'ltr' | 'rtl'
}

export interface ContentType {
  label: string
  value: string
}

interface InsightContent {
  id: string
  url: string
  streamingUrl: string
  mimeType: string
  filesize: number
}

export interface Insight {
  id: string
  title: string
  description: {
    root: RichTextNode
  }
  insight_location: string
  review_status: string
  state: string
  review_commentary: string
  createdAt: string
  updatedAt: string
  contents?: InsightContent
  createdBy: {
    id: string
  }
}

export interface MediaSource {
  url: string
  mimeType: string
}

export interface PendingMediaUpdate {
  id: string
  url: string
  mimeType: string
}

export interface InsightPayload {
  title: string
  description: string
  insight_location: string
  review_status: string
  state: string
  review_commentary: string
  metadata: {
    onLogIn: boolean
    default: boolean
  }
  createdBy: string
  contents?: number | null
}

export interface UserResponse {
  user: {
    id: string
  }
}

export interface LexicalRoot {
  root: {
    children: Array<{
      children: Array<{ text: string }>
      direction: 'ltr' | 'rtl'
      format: string
      indent: number
      type: string
      version: number
    }>
    direction: 'ltr' | 'rtl'
    format: string
    indent: number
    type: 'root'
    version: number
  }
}

export interface InsightFormData {
  title: string
  description: {
    root: RichTextNode
  }
  insight_location: string
  review_status: string
  state: string
  review_commentary: string
}

export interface MediaItem {
  id: string
  filename: string
  mimeType: string
  filesize: number
  url: string
  streamingUrl: string
  createdAt: string
}

export interface UploadProgress {
  bytesUploaded: number
  bytesTotal: number
  speed: number
  eta: number
}

export interface UploadAreaProps {
  onUploadComplete: (fileMeta: {
    id: string
    url: string
    streamingUrl: string
    mimeType: string
  }) => void
  mimeTypes?: string[]
  onProgress?: (progress: number) => void
  className?: string
  currentMedia?: { url: string; mimeType: string } | null
  onRemoveMedia?: () => void
  isModalOpen?: boolean
  onModalOpenChange?: (open: boolean) => void
  fileSize?: number
}

export type InsightFormDataWithContents = InsightFormData & {
  contents?: number | null
}
