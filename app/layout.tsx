import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Providers } from '@/app/Providers'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Lolbets',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className='flex h-screen'>
            <Sidebar />
            <div className='bg-custom-blue-100 w-full overflow-auto'>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
