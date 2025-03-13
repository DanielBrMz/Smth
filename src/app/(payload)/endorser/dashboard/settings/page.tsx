import React, { Fragment } from 'react'
import { Gutter } from '@/components/shared/Gutter'
import { HR } from '@/components/shared/HR'
import { RenderParams } from '@/components/shared/RenderParams'
import AccountForm from '@/components/settings/AccountForm'

export default function Settings() {
  return (
    <Fragment>
      <Gutter>
        <RenderParams className="mt-[var(--base)]" />
      </Gutter>
      <Gutter className="w-1/2 mb-[var(--block-padding)]">
        <AccountForm />
        <HR />
      </Gutter>
    </Fragment>
  )
}
