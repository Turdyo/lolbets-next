import { Sidebar } from '@/components/Sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import logo from '@/public/icon.png'
import Link from 'next/link'
import { ReactNode } from 'react'

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
            <Link className='flex items-center gap-6 m-4 self-center cursor-pointer' href={"/"}>
              <Image src={logo} alt="Logo" width={50} />
              <h1 className='text-4xl font-bold'>LOLBETS</h1>
            </Link>
            <Sidebar />
          </div>
          <div className='bg-[#1b202b] w-[calc(100vw-18rem)]'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
