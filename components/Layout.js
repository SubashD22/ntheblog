import Head from 'next/head'
import React from 'react'
import Navbar from './Navbar/Navbar'

const Layout = ({children}) => {
  return (
    <div className='latout'>
            <Head>
                <title>BLOG</title>
            </Head>
            <header>
                <Navbar />
            </header>
            <main>
                {children}
            </main>
            <footer>
            </footer>
        </div>
  )
}

export default Layout