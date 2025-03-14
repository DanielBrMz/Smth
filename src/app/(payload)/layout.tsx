/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { Toaster } from 'react-hot-toast'

import { importMap } from './admin/importMap.js'
import './custom.scss'
import './globals.css'
import { Metadata } from 'next'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Sidepocket Endorser Platform',
  description: 'Welcome to your centralized content management hub',
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <Toaster position="bottom-center" />
    {children}
  </RootLayout>
)

export default Layout
