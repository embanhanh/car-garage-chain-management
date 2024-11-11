import { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import './Modal.css'

const Modal = memo(({ isOpen, onClose, title, children, width = '500px', showHeader = true }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ width: width }}
      >
        {showHeader && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
})

Modal.displayName = 'Modal'

export default Modal
