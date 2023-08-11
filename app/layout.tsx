import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { Provider } from '@/components/Provider'
import { Sidebar } from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

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
        <Provider>
          <div className='flex h-screen'>
            <Sidebar />
            <div className='bg-custom-blue-100 w-[calc(100vw-18rem)]'>
              {children}
            </div>
          </div>
        </Provider>
      </body>
    </html>
  )
}
