import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './MeasurementGuide.css'

function MeasurementGuide() {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="measurement-guide">
      <div 
        className="measurement-guide-header" 
        onClick={() => setExpanded(!expanded)}
      >
        <h2>📐 {t('measurement_guide_title')}</h2>
        <span className={`measurement-guide-toggle ${expanded ? 'expanded' : ''}`}>
          ▼
        </span>
      </div>
      <div className={`measurement-guide-content ${expanded ? 'expanded' : ''}`}>
        <div className="measurement-section">
          <h3>{t('measurement_guide_lphys_title')}</h3>
          <div className="measurement-explanation">
            <div className="measurement-text">
              <p>{t('measurement_guide_lphys_desc')}</p>
              <ul>
                <li>{t('measurement_guide_lphys_point1')}</li>
                <li>{t('measurement_guide_lphys_point2')}</li>
                <li>{t('measurement_guide_lphys_point3')}</li>
              </ul>
            </div>
            <div className="measurement-image">
              {/* Placeholder pour illustration Lphys */}
              <div className="image-placeholder">
                <span>🎵</span>
                <p>{t('measurement_guide_image_lphys')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="measurement-section">
          <h3>{t('measurement_guide_dinner_title')}</h3>
          <div className="measurement-explanation">
            <div className="measurement-text">
              <p>{t('measurement_guide_dinner_desc')}</p>
              <ul>
                <li>{t('measurement_guide_dinner_point1')}</li>
                <li>{t('measurement_guide_dinner_point2')}</li>
                <li>{t('measurement_guide_dinner_point3')}</li>
              </ul>
            </div>
            <div className="measurement-image">
              {/* Placeholder pour illustration Dinner */}
              <div className="image-placeholder">
                <span>⭕</span>
                <p>{t('measurement_guide_image_dinner')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="measurement-section">
          <h3>{t('measurement_guide_freq_title')}</h3>
          <div className="measurement-explanation">
            <div className="measurement-text">
              <p>{t('measurement_guide_freq_desc')}</p>
              <ul>
                <li>{t('measurement_guide_freq_point1')}</li>
                <li>{t('measurement_guide_freq_point2')}</li>
                <li>{t('measurement_guide_freq_point3')}</li>
              </ul>
            </div>
            <div className="measurement-image">
              {/* Placeholder pour illustration mesure de fréquence */}
              <div className="image-placeholder">
                <span>🎼</span>
                <p>{t('measurement_guide_image_freq')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="measurement-section">
          <h3>{t('measurement_guide_tips_title')}</h3>
          <div className="measurement-tips">
            <div className="tip-box">
              <strong>💡 {t('measurement_guide_tip1_title')}</strong>
              <p>{t('measurement_guide_tip1_desc')}</p>
            </div>
            <div className="tip-box">
              <strong>⚠️ {t('measurement_guide_tip2_title')}</strong>
              <p>{t('measurement_guide_tip2_desc')}</p>
            </div>
            <div className="tip-box">
              <strong>🎯 {t('measurement_guide_tip3_title')}</strong>
              <p>{t('measurement_guide_tip3_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeasurementGuide
