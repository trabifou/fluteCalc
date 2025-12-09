import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import InputGroup from '../components/InputGroup/InputGroup'
import { calculateAcousticalPositions } from '../utils/calculations'

function AcousticalPage() {
  const { t } = useTranslation()
  
  // Input states
  const [baseFrequency, setBaseFrequency] = useState(293.66)
  const [diameter, setDiameter] = useState(19)
  const [temperature, setTemperature] = useState(20)
  const [numHoles, setNumHoles] = useState(6)
  
  // Results state
  const [results, setResults] = useState(null)

  // Calculate positions
  const handleCalculate = () => {
    const positions = calculateAcousticalPositions(
      baseFrequency,
      diameter,
      temperature,
      numHoles
    )
    setResults(positions)
  }

  // Current inputs display for algorithm explanation
  const currentInputs = (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      {t('algo_base_frequency')} {baseFrequency} Hz<br />
      {t('algo_inner_diameter')} {diameter} mm<br />
      {t('algo_temperature')} {temperature} °C<br />
      {t('algo_number_of_holes')} {numHoles}
    </>
  )

  return (
    <div>
      <AlgorithmExplanation 
        title={t('algo_acoustical_title')}
        inputs={currentInputs}
      >
        <p>{t('algo_acoustical_intro')}</p>
        
        <h3>{t('algo_xiao_how_title')}</h3>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_how_1') }} />
          <li>{t('algo_acoustical_how_2')}</li>
          <li>{t('algo_acoustical_how_3')}</li>
          <li>{t('algo_acoustical_how_4')}</li>
        </ul>

        <h3>{t('algo_calc_details_title')}</h3>
        <p>{t('algo_calc_details_intro')}</p>
        <ul>
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_1') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_2') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_3') }} />
          <li dangerouslySetInnerHTML={{ __html: t('algo_acoustical_calc_4') }} />
        </ul>
      </AlgorithmExplanation>

      <div className="input-section">
        <h3>{t('input_parameters')}</h3>
        <div className="input-grid">
          <InputGroup label={t('base_frequency')} hint={t('base_frequency_hint')}>
            <input
              type="number"
              value={baseFrequency}
              onChange={(e) => setBaseFrequency(parseFloat(e.target.value))}
              min="100"
              max="1000"
              step="1"
            />
          </InputGroup>
          
          <InputGroup label={t('inner_diameter')} hint={t('inner_diameter_hint')}>
            <input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(parseFloat(e.target.value))}
              min="10"
              max="50"
              step="0.5"
            />
          </InputGroup>
          
          <InputGroup label={t('temperature')} hint={t('temperature_hint')}>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              min="-10"
              max="40"
              step="1"
            />
          </InputGroup>
          
          <InputGroup label={t('number_of_holes')}>
            <select 
              value={numHoles} 
              onChange={(e) => setNumHoles(parseInt(e.target.value))}
            >
              <option value="5">{t('holes_5')}</option>
              <option value="6">{t('holes_6')}</option>
              <option value="7">{t('holes_7')}</option>
              <option value="8">{t('holes_8')}</option>
            </select>
          </InputGroup>
        </div>
        
        <button className="calculate-button" onClick={handleCalculate}>
          {t('calculate_positions')}
        </button>
      </div>

      {results && results.length > 0 && (
        <div className="results-section">
          <h3>{t('calculated_positions')}</h3>
          <table>
            <thead>
              <tr>
                <th>{t('table_hole')}</th>
                <th>{t('table_distance_from_edge')}</th>
                <th>{t('table_note')}</th>
                <th>{t('table_frequency')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.hole}>
                  <td>{row.hole}</td>
                  <td>{row.position.toFixed(2)}</td>
                  <td>{row.note}</td>
                  <td>{row.frequency.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AcousticalPage
