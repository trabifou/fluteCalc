import { useTranslation } from 'react-i18next'

function ResultsTable({ results, columns, showVisualize = false, onVisualize }) {
  const { t } = useTranslation()

  if (!results || results.length === 0) {
    return null
  }

  return (
    <div className="results-section">
      <h3>{t('calculated_positions')}</h3>
      {showVisualize && onVisualize && (
        <button className="visualization-button" onClick={onVisualize}>
          {t('visualize_flute')}
        </button>
      )}
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row, rowIndex, results) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultsTable
