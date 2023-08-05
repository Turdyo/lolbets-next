import { Sidebar } from '@/components/Sidebar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lolbets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='flex h-screen'>
          <div className='bg-[#1c2535]'>
            <Sidebar />
          </div>
          <div className='bg-[#1b202b] w-full'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
