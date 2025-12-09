function InputGroup({ label, hint, children }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      {children}
      {hint && <div className="input-hint">{hint}</div>}
    </div>
  )
}

export default InputGroup
