import clsx from 'clsx'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export type Item = {
  text: string
  slug?: string
  segment?: string
  parallelRoutesKey?: string
}

export type SideButtonProps = {
  parallelRoutesKey?: string
  path: string
  item: Item
}

export function SideButton({ path, item, parallelRoutesKey }: SideButtonProps) {
  const segment = useSelectedLayoutSegment(parallelRoutesKey)

  const href = item.slug ? path + '/' + item.slug : path
  const isActive =
    // Example home pages e.g. `/layouts`
    (!item.slug && segment === null) ||
    segment === item.segment ||
    // Nested pages e.g. `/layouts/electronics`
    segment === item.slug

  return (
    <Link
      href={href}
      className={clsx(
        'fully_animated text-md flex h-[2rem] min-w-[10rem] items-center justify-start whitespace-nowrap pl-6 text-white sm:justify-center sm:border-l-4 sm:pl-8',
        {
          'border-transparent hover:border-transparent hover:font-bold': !isActive,
          'border-b-4 border-soft_purple font-bold sm:border-b-0 sm:border-soft_purple sm:bg-opacity-20':
            isActive,
        },
      )}
    >
      {item.text}
    </Link>
  )
}

export default function SideSubNavigation({
  path,
  parallelRoutesKey,
  items,
}: {
  path: string
  parallelRoutesKey?: string
  items: Item[]
}) {
  return (
    <div className="flex w-full flex-row space-x-4 overflow-x-auto sm:flex-col sm:items-center sm:space-x-0 sm:space-y-4">
      {items.map((item) => (
        <SideButton
          key={path + (item.slug ?? item.text)}
          path={path}
          item={item}
          parallelRoutesKey={parallelRoutesKey}
        />
      ))}
    </div>
  )
}
