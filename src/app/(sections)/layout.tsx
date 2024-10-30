import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <Header />
      <main className='mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {children}
      </main>
      <Footer />
    </div>
  )
}