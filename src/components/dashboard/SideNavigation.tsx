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
  const checkedSegment = segment ? segment.replace(/[()]/g, '') : segment

  const href = item.slug ? path + '/' + item.slug : path
  const isActive =
    (!item.slug && checkedSegment === null) ||
    checkedSegment === item.segment ||
    checkedSegment === item.slug

  return (
    <Link
      href={href}
      className={clsx(
        'flex h-[4.125rem] w-full items-center justify-start rounded-xl pl-16 text-lg font-semibold text-white no-underline',
        {
          'fully_animated outline-2 outline-white hover:bg-gray-500 hover:bg-opacity-20': !isActive,
          'bg-soft_purple bg-opacity-10 outline outline-2 outline-soft_purple': isActive,
        },
      )}
    >
      {item.text}
    </Link>
  )
}

export default function SideNavigation({
  path,
  parallelRoutesKey,
  items,
}: {
  path: string
  parallelRoutesKey?: string
  items: Item[]
}) {
  return (
    <div className="flex h-fit min-w-[19.5625rem] flex-col items-center space-y-3">
      {items.map((item) => (
        <SideButton
          key={path + item.slug}
          path={path}
          item={item}
          parallelRoutesKey={parallelRoutesKey}
        />
      ))}
    </div>
  )
}
