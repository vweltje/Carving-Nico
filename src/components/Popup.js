import React from 'react'
import { X } from 'react-feather'

import './Popup.css'

const Popup = ({ open, setOpen, children }) => {
  return (
    <>
      {open ? (
        <div className="Popup-Overlay">
          <div
            className="Popup-Background"
            onClick={() => setOpen(false)}
          ></div>
          <div className="Popup-Inner">
            <X className="Popup-Close" onClick={() => setOpen(false)} />
            {children}
          </div>
        </div>
      ) : null}
    </>
  )
}
export default Popup
