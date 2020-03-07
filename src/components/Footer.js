import React from 'react'
import InstagramFeed from './InstagramFeed'
import './Footer.css'

export default () => (
  <div>
    <footer className="footer">
      <div className="container taCenter">
        <span>
          © Copyright {new Date().getFullYear()} Carving Nico. Developed door{' '}
          <a href="http://vweltje.nl/">vweltje</a>.
        </span>
      </div>
    </footer>
  </div>
)
