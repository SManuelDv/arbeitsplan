import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from '@/components/ui/Layout'

export function DefaultLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
} 