import { useTranslation } from 'react-i18next'
import InputGroup from '../InputGroup/InputGroup'

function Step2PhysicalMeasurements({ 
  physicalLength, 
  setPhysicalLength,
  innerDiameter, 
  setInnerDiameter,
  wallThickness,
  setWallThickness,
  temperature, 
  setTemperature,
  note1Frequency, 
  setNote1Frequency,
  effectiveLength,
  deltaAverage,
  baseNoteName,
  measuredDelta,
  measurementCount,
  validationError
}) {
  const { t } = useTranslation()

  return (
    <div className="input-section">
      <h3>{t('step2_title')}</h3>
      <div className="input-grid">
        <InputGroup label={t('step2_lphys')} hint={t('step2_lphys_hint')} unit="mm">
          <input
            type="number"
            value={physicalLength}
            onChange={(e) => setPhysicalLength(parseFloat(e.target.value))}
            min="100"
            max="1000"
            step="1"
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>
        
        <InputGroup label={t('step2_dinner')} hint={t('step2_dinner_hint')} unit="mm">
          <input
            type="number"
            value={innerDiameter}
            onChange={(e) => setInnerDiameter(parseFloat(e.target.value))}
            min="10"
            max="50"
            step="0.5"
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>
        
        <InputGroup label={t('step2_wall_thickness')} hint={t('step2_wall_thickness_hint')} unit="mm">
          <input
            type="number"
            value={wallThickness}
            onChange={(e) => setWallThickness(parseFloat(e.target.value))}
            min="1"
            max="10"
            step="0.5"
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>
        
        <InputGroup label={t('temperature')} hint="Pour la vitesse du son (optionnel)" unit="°C">
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            min="-10"
            max="40"
            step="1"
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>

        <InputGroup label={t('step2_note1_freq')} hint={t('step2_note1_hint')} unit="Hz">
          <input
            type="number"
            value={note1Frequency}
            onChange={(e) => setNote1Frequency(parseFloat(e.target.value))}
            min="100"
            max="1000"
            step="0.01"
            style={{ paddingRight: '35px' }}
          />
        </InputGroup>
      </div>

      {effectiveLength > 0 && (
        <>
          <div style={{ marginTop: '20px', padding: '15px', background: '#e8dcc8', borderRadius: '8px' }}>
            <strong>{t('step2_calculated_values')}</strong><br />
            {t('step2_leff')} {effectiveLength.toFixed(2)} mm<br />
            {t('step2_delta')} {deltaAverage?.toFixed(2) || '—'} mm
            {measuredDelta !== null && (
              <span style={{ color: '#4caf50', fontWeight: 'bold', marginLeft: '10px' }}>
                → {measuredDelta.toFixed(2)} mm ✓ (mesuré ×{measurementCount})
              </span>
            )}
            <br />
            <em>{t('step2_base_note')}</em> <strong>{baseNoteName}</strong>
          </div>
          
          {validationError && (
            <div style={{
              marginTop: '15px',
              padding: '15px',
              background: 'rgba(184, 85, 66, 0.2)',
              border: '2px solid #B85542',
              borderRadius: '8px',
              color: '#5d4a37'
            }}>
              <strong style={{ color: '#B85542' }}>{t('step2_error_title')}</strong><br />
              {t('step2_error_invalid_positions')}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Step2PhysicalMeasurements
