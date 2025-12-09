import { useState } from 'react'

function AlgorithmExplanation({ title, inputs, children }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="algorithm-explanation">
      <div 
        className="algorithm-explanation-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <h2>{title}</h2>
        <span className={`algorithm-explanation-toggle ${expanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>
      <div className={`algorithm-explanation-content ${expanded ? 'expanded' : ''}`}>
        {inputs && (
          <div className="algorithm-inputs">
            {inputs}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default AlgorithmExplanation
