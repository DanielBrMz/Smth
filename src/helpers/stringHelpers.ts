import { LexicalRoot } from '@/types'

// Helper function to convert string to LexicalRoot structure
export const stringToLexicalRoot = (text: string): LexicalRoot => {
  return {
    root: {
      children: [
        {
          children: [{ text: text || '' }],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

// Helper function to convert LexicalRoot to string
export const lexicalRootToString = (value: LexicalRoot): string => {
  if (!value?.root?.children?.length) return ''
  return value.root.children.map((node) => node.children?.[0]?.text || '').join('\n')
}
