import { Navbar } from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { ReactNode } from 'react'
import { Logo } from '@/components/Logo'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lolbets',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='flex h-screen'>
          <div className='bg-[#1c2535] flex flex-col w-72 shrink-0'>
            <Logo />
            <Navbar />
          </div>
          <div className='bg-[#1b202b] w-[calc(100vw-18rem)] '>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
