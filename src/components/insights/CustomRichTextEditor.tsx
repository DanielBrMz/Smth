'use client'

import React, { useState, useEffect, useCallback, JSX } from 'react'
import { SerializedLexicalNode } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type EditorState,
  ParagraphNode,
  TextNode,
} from 'lexical'
import { HeadingNode, $createHeadingNode } from '@lexical/rich-text'
import {
  ListNode,
  ListItemNode,
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list'
import { Bold, Italic, Underline, Subscript, Superscript, List, ListOrdered } from 'lucide-react'
import clsx from 'clsx'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'

// Types
type InlineStyle = 'bold' | 'italic' | 'underline' | 'subscript' | 'superscript'
type BlockType = 'paragraph' | 'heading' | 'list'

interface SerializedTextNode {
  type: 'text'
  text: string
  detail?: number
  format?: number
  style?: string
  mode?: 'normal' | 'token' | 'segmented'
  version: 1
}

interface SerializedElementNode {
  type: string
  children: SerializedNode[]
  direction?: 'ltr' | 'rtl'
  format?: number
  indent?: number
  version: 1
}

type SerializedNode = SerializedTextNode | SerializedElementNode | SerializedLexicalNode

interface LexicalRoot {
  root: {
    children: SerializedNode[]
    direction: 'ltr' | 'rtl'
    format: number
    indent: number
    type: 'root'
    version: number
  }
}

interface CustomRichTextEditorProps {
  value?: ReturnType<EditorState['toJSON']>
  onChange: (value: ReturnType<EditorState['toJSON']>) => void
  className?: string
  placeholder?: string
  label?: string
}

interface EditorTheme {
  text: {
    bold: string
    italic: string
    underline: string
    strikethrough: string
    subscript: string
    superscript: string
  }
  paragraph: string
  heading: {
    h1: string
    h2: string
    h3: string
    h4: string
  }
  list: {
    ul: string
    ol: string
    listitem: string
  }
}

// Theme configuration
const theme: EditorTheme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    subscript: 'align-sub',
    superscript: 'align-super',
  },
  paragraph: 'm-0',
  heading: {
    h1: 'text-4xl font-bold my-4',
    h2: 'text-3xl font-bold my-3',
    h3: 'text-2xl font-bold my-2',
    h4: 'text-xl font-bold my-2',
  },
  list: {
    ul: 'list-disc list-inside my-2',
    ol: 'list-decimal list-inside my-2',
    listitem: 'my-1',
  },
}

const getDefaultEditorState = () => {
  const editorState = JSON.stringify({
    root: {
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: '',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: 0,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: 0,
      indent: 0,
      type: 'root',
      version: 1,
    },
  })
  return editorState
}

const defaultValue = JSON.parse(getDefaultEditorState())

function RestorePlugin({ initialValue }: { initialValue?: LexicalRoot }): null {
  const [editor] = useLexicalComposerContext()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (isFirstRender && initialValue) {
      setIsFirstRender(false)
      editor.update(() => {
        const root = $getRoot()
        root.clear()
      })

      setTimeout(() => {
        try {
          const editorState = editor.parseEditorState(JSON.stringify(initialValue))

          if (editorState._nodeMap.size > 1) editor.setEditorState(editorState)
        } catch (error) {
          console.error('Error parsing editor state:', error)
        }
      }, 100)
    }
  }, [isFirstRender, editor, initialValue])

  return null
}

function ToolbarPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [activeInlineStyles, setActiveInlineStyles] = useState<Set<InlineStyle>>(new Set())
  const [activeBlockType, setActiveBlockType] = useState<BlockType>('paragraph')

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const styles = new Set<InlineStyle>()
        const format = selection.format

        if (format & 1) styles.add('bold') // FORMAT_BIT_MASK.BOLD
        if (format & 2) styles.add('italic') // FORMAT_BIT_MASK.ITALIC
        if (format & 4) styles.add('underline') // FORMAT_BIT_MASK.UNDERLINE
        if (format & 16) styles.add('subscript') // FORMAT_BIT_MASK.SUBSCRIPT
        if (format & 32) styles.add('superscript') // FORMAT_BIT_MASK.SUPERSCRIPT

        setActiveInlineStyles(styles)

        const anchorNode = selection.anchor.getNode()
        const element = anchorNode.getParent()
        if ($isListNode(element)) {
          setActiveBlockType('list')
        } else if (element?.getType() === 'heading') {
          setActiveBlockType('heading')
        } else {
          setActiveBlockType('paragraph')
        }
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar())
    })
  }, [editor, updateToolbar])

  const toggleInlineStyle = useCallback(
    (style: InlineStyle): void => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, style)
    },
    [editor],
  )

  const toggleHeading = useCallback(
    (level: 'h1' | 'h2' | 'h3' | 'h4'): void => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const nodes = selection.getNodes()
          nodes.forEach((node) => {
            const parent = node.getParent()
            if (parent?.getType() === 'paragraph' || parent?.getType()?.startsWith('heading')) {
              const heading = $createHeadingNode(level)
              heading.append(...parent.getChildren())
              parent.replace(heading)
            }
          })
        }
      })
    },
    [editor],
  )

  const toggleList = useCallback(
    (listType: 'bullet' | 'number'): void => {
      editor.dispatchCommand(
        listType === 'bullet' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
        undefined,
      )
    },
    [editor],
  )

  return (
    <div className="flex items-center space-x-2 p-2 border-b border-[#384455] h-14">
      {/* Heading selector */}
      <div className="flex space-x-1">
        {(['h1', 'h2', 'h3', 'h4'] as const).map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => toggleHeading(level)}
            className={clsx('text-[#888a97] hover:text-white p-1 px-2', {
              'text-white bg-[#7849de]': editor.getEditorState().read(() => {
                const selection = $getSelection()
                const node = ($isRangeSelection(selection) ? selection.anchor : null)?.getNode()
                return node?.getParent()?.getType() === level
              }),
            })}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="h-5 w-px bg-[#384455]" />
      {/* Text formatting */}
      {(
        [
          ['bold', Bold],
          ['italic', Italic],
          ['underline', Underline],
        ] as const
      ).map(([style, Icon]) => (
        <button
          key={style}
          type="button"
          onClick={() => toggleInlineStyle(style)}
          className={clsx('text-[#888a97] hover:text-white p-1', {
            'text-white bg-[#7849de]': activeInlineStyles.has(style),
          })}
        >
          <Icon size={16} />
        </button>
      ))}
      {/* Subscript/Superscript */}
      <div className="flex flex-col space-y-1">
        <button
          type="button"
          onClick={() => toggleInlineStyle('subscript')}
          className={clsx('text-[#888a97] hover:text-white p-0.5', {
            'text-white bg-[#7849de]': activeInlineStyles.has('subscript'),
          })}
        >
          <Subscript size={14} />
        </button>
        <button
          type="button"
          onClick={() => toggleInlineStyle('superscript')}
          className={clsx('text-[#888a97] hover:text-white p-0.5', {
            'text-white bg-[#7849de]': activeInlineStyles.has('superscript'),
          })}
        >
          <Superscript size={14} />
        </button>
      </div>
      {/* Lists */}
      <div className="flex space-x-1">
        <button
          type="button"
          onClick={() => toggleList('bullet')}
          className={clsx('text-[#888a97] hover:text-white p-1', {
            'text-white bg-[#7849de]': activeBlockType === 'list',
          })}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => toggleList('number')}
          className={clsx('text-[#888a97] hover:text-white p-1', {
            'text-white bg-[#7849de]': activeBlockType === 'list',
          })}
        >
          <ListOrdered size={16} />
        </button>
      </div>
    </div>
  )
}

const CustomRichTextEditor: React.FC<CustomRichTextEditorProps> = ({
  value = defaultValue,
  onChange,
  className,
  placeholder,
  label,
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = useCallback(
    (editorState: EditorState): void => {
      const editorStateJSON = editorState.toJSON()
      const root = editorStateJSON.root

      // Limit to 15 lines
      if (root.children.length > 15) {
        root.children = root.children.slice(0, 15)
      }

      onChange(editorStateJSON)
    },
    [onChange],
  )

  const initialConfig = {
    namespace: 'CustomEditor',
    theme,
    nodes: [TextNode, ParagraphNode, HeadingNode, ListNode, ListItemNode, HorizontalRuleNode],
    onError: () => {},
    editable: true,
  }

  return (
    <div className={clsx('relative', className)}>
      {label && (
        <span
          className={clsx('absolute left-8 top-5 text-[#888a97] duration-200 pointer-events-none', {
            '-translate-x-2 -translate-y-[30px] text-[0.75rem] text-indigo-600': isFocused,
          })}
        >
          {label}
        </span>
      )}
      <div
        className={clsx(
          'w-full rounded-2xl border-2 border-[#384455] bg-gray-700 bg-opacity-30 overflow-hidden duration-200',
          'hover:border-gray-400',
          { 'border-indigo-600': isFocused },
        )}
        style={{ minHeight: '12rem' }}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <RestorePlugin initialValue={value} />
          <ToolbarPlugin />
          <div className="p-4 relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className={clsx(
                    'outline-none min-h-[10rem] text-white',
                    // Apply heading styles dynamically
                    '[&>h1]:text-4xl [&>h1]:font-bold [&>h1]:my-4',
                    '[&>h2]:text-3xl [&>h2]:font-bold [&>h2]:my-3',
                    '[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:my-2',
                    '[&>h4]:text-xl [&>h4]:font-bold [&>h4]:my-2',
                    // Apply list styles
                    '[&>ul]:list-disc [&>ul]:list-inside [&>ul]:my-2',
                    '[&>ol]:list-decimal [&>ol]:list-inside [&>ol]:my-2',
                    '[&>li]:my-1',
                  )}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              }
              placeholder={
                placeholder ? (
                  <div
                    className={clsx(
                      'text-[#888a97] absolute left-4 pointer-events-none',
                      'top-4', // Position it below the toolbar
                    )}
                  >
                    {placeholder}
                  </div>
                ) : null
              }
              ErrorBoundary={({ children }) => <div className="text-red-500">{children}</div>}
            />
            <HistoryPlugin />
            <OnChangePlugin onChange={handleChange} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  )
}

export default CustomRichTextEditor
