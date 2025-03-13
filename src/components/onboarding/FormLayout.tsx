import React from 'react'
import FormText from './FormText'
// import FormProgressBar from './FormProgressBar'
import GoBackButton from '@/components/shared/GoBackButton'
import { cn } from '@/lib/utils'

interface FormTextProps extends React.PropsWithChildren {
  titleText: string
  bodyText: React.ReactNode
  noteText?: string
  insight_location?: string
}

interface FormLayoutProps extends FormTextProps {
  progress_bar?: boolean
  customNav?: React.ReactNode // New property for custom navigation elements
  showGoBackButton?: boolean
}

export default function FormLayout({
  titleText,
  bodyText,
  noteText,
  customNav,
  showGoBackButton = true, // Optional boolean to control button display
  children,
}: FormLayoutProps) {
  const showProgressBar = false

  return (
    <>
      <div className="flex w-full max-w-[100rem] flex-col items-end max-md:items-start md:flex-row md:justify-between">
        <nav
          className={cn('mt-12 flex h-[3.6rem] w-full px-5 pt-[3rem]', {
            'w-fit pr-0 max-md:h-fit': false,
          })}
        >
          {/* Conditional rendering based on showGoBackButton */}
          {showGoBackButton ? <GoBackButton text="Back" className="h-fit" /> : customNav}
        </nav>
        {showProgressBar && (
          <div className="mb flex w-full items-center justify-center">
            <div className="max-w-[31.25rem] flex-grow md:mr-[5.25rem] md:mt-0 md:w-auto md:min-w-[31.25rem]">
              <div className="ml-auto mr-auto md:ml-auto md:mr-0">
                {/* <FormProgressBar page={page} /> */}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1"></div>
      </div>
      <div
        className={cn(
          'relative mt-4 flex h-full w-full max-w-[31.25rem] flex-col items-center pt-[3.125rem]',
          { 'max-md:pt-[.5rem]': showProgressBar },
        )}
      >
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className="mb-[3rem] h-full w-full">
            <FormText titleText={titleText} bodyText={bodyText} noteText={noteText} />
          </div>
          <div className="flex h-full w-full flex-col items-start justify-start space-y-3">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
