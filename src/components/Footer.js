import React from 'react'
import { Link } from 'gatsby'
import './Footer.css'

export default () => (
  <div>
    <footer className="footer">
      <div className="container taCenter">
        <span>
          © Copyright {new Date().getFullYear()}{' '}
          <Link to="/">Carving Nico</Link>. Site ontwikkeld door{' '}
          <a href="http://vweltje.nl/">vweltje</a>.
        </span>
      </div>
    </footer>
  </div>
)
