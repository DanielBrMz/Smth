import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

type OptionType = {
  label: string
  value: string
}

export default function Select({
  placeholder,
  options,
  selectedOption,
  setSelectedOption,
}: {
  placeholder: string
  options: Array<OptionType>
  selectedOption: OptionType | null
  setSelectedOption: (option: OptionType) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOptionClick = (option: OptionType) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <div className="container mx-auto p-0">
      <div className="relative mt-1">
        <button
          id="customSelect"
          onClick={(e) => {
            e.preventDefault()
            setIsOpen(!isOpen)
          }}
          className={clsx(
            'bg-gray-700 relative z-20 flex h-fit min-h-[4.125rem] w-full items-center justify-between rounded-xl px-6 py-2 pl-8 text-start text-white hover:bg-[#33334e] border-none outline-none',
            { 'bg-[#33334e]': isOpen },
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}

          <ChevronDownIcon
            className={clsx('fully_animated h-[26px] w-[26px] stroke-white', {
              'rotate-180': isOpen,
            })}
          />
        </button>

        {isOpen && (
          <div className="absolute top-10 z-10 mt-1 w-full rounded-xl bg-[#1b1a39] pt-2">
            <ul className="max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="flex min-h-[4rem] cursor-pointer items-center px-3 py-2 pl-8 text-white hover:bg-[#33334e]"
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
