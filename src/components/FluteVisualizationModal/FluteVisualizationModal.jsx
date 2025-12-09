import { useEffect } from 'react'
import { generateFluteSVG } from '../../utils/fluteDrawing'

function FluteVisualizationModal({ isOpen, onClose, fluteData }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !fluteData) {
    return null
  }

  const svgContent = generateFluteSVG(fluteData)

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className={`modal-backdrop ${isOpen ? 'active' : ''}`} 
      onClick={handleBackdropClick}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div 
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      </div>
    </div>
  )
}

export default FluteVisualizationModal
