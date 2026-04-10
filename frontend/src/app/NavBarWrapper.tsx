'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LeftPanel } from '@/components/Navbar/left_panel'
import { useEffect, useState } from 'react'
import { apiClient } from '@/services/api'

export default function NavWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    apiClient
      .get('/auth/me')
      .then((res) => {
        router.replace('/tasks')
      })
      .catch((err) => {
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [])

  const authRoutes = ['/login', '/signup']
  const isAuthPage = authRoutes.some((route) => pathname.startsWith(route))

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full">{loading ? <></> : children}</div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {loading ? (
        <></>
      ) : (
        <>
          <LeftPanel />
          <div className="flex-1 pl-66">{children}</div>
        </>
      )}
    </div>
  )
}
