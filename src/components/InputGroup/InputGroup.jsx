import React from 'react'

function InputGroup({ label, hint, unit, children }) {
  // Clone l'enfant pour ajouter width: 100% si une unité est fournie
  const inputElement = unit 
    ? React.cloneElement(children, {
        style: { ...children.props.style, width: '100%', boxSizing: 'border-box' }
      })
    : children;

  return (
    <div className="input-group">
      <label>{label}</label>
      {unit ? (
        <div style={{ position: 'relative', width: '100%' }}>
          {inputElement}
          <span style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translate(0, -50%)',
            width: '35px',
            textAlign: 'center',
            pointerEvents: 'none',
            color: '#9a8a6a',
            fontSize: '0.85em',
            fontStyle: 'normal'
          }}>
            {unit}
          </span>
        </div>
      ) : (
        children
      )}
      {hint && <div className="input-hint">{hint}</div>}
    </div>
  )
}

export default InputGroup
