import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Router from '../routes/Router'
function Layout() {
  return (
    <div>
      <Header />
        <div >
            <Router />
        </div>
      <Footer />
    </div>
  )
}

export default Layout