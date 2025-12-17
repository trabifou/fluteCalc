import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import AlgorithmExplanation from '../components/AlgorithmExplanation/AlgorithmExplanation'
import Step1CalculationMethod from '../components/AcousticalSteps/Step1CalculationMethod'
import Step2PhysicalMeasurements from '../components/AcousticalSteps/Step2PhysicalMeasurements'
import Step3TargetNotes from '../components/AcousticalSteps/Step3TargetNotes'
import MeasureModal from '../components/MeasureModal/MeasureModal'
import { 
  calculateEffectiveLength, 
  calculateDeltaFromTwoNotes, 
  calculateHolePosition,
  recalculatePositionsAfterMeasurement,
  shiftFollowingNotes,
  generateTargetNotes,
  getClosestNote,
  calculateFrequencyFromNote,
  chromaticScale
} from '../utils/calculations'

function AcousticalPage() {
  const { t } = useTranslation()
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState(null)
  
  // Step 1: Calculation method selection
  const [calculationMethod, setCalculationMethod] = useState('half-wave') // 'half-wave' or 'quarter-wave'
  
  // Step 2: Physical measurements
  const [physicalLength, setPhysicalLength] = useState(400) // Lphys
  const [innerDiameter, setInnerDiameter] = useState(19) // Dinner
  const [temperature, setTemperature] = useState(20)
  const [note1Frequency, setNote1Frequency] = useState(293.66) // Normal breath
  const [note2Frequency, setNote2Frequency] = useState(0) // Strong breath (optional)
  
  // Step 3: Target notes (structure de base: notes, frequences, diametres)
  const [targetNotesBase, setTargetNotesBase] = useState(generateTargetNotes(293.66, 5))
  
  const minNotes = 5
  const maxNotes = calculationMethod === 'half-wave' ? 10 : 7

  // Regenerer les notes de base quand la frequence change
  useEffect(() => {
    setTargetNotesBase(generateTargetNotes(note1Frequency, targetNotesBase.length))
  }, [note1Frequency])

  // Calculer effectiveLength automatiquement
  const effectiveLength = useMemo(() => {
    return calculateEffectiveLength(note1Frequency, temperature, calculationMethod)
  }, [note1Frequency, temperature, calculationMethod])

  // Calculer deltaAverage automatiquement
  const deltaAverage = useMemo(() => {
    if (note2Frequency > 0) {
      return calculateDeltaFromTwoNotes(
        note1Frequency,
        note2Frequency,
        temperature,
        calculationMethod
      )
    } else {
      return calculationMethod === 'half-wave' 
        ? 0.6 * (innerDiameter / 2)
        : 1.0 * (innerDiameter / 2)
    }
  }, [note2Frequency, note1Frequency, temperature, calculationMethod, innerDiameter])

  // Calculer les positions des notes automatiquement
  const targetNotes = useMemo(() => {
    if (!effectiveLength || !deltaAverage) return targetNotesBase

    return targetNotesBase.map((note, index) => {
      if (!note.isMeasured) {
        const position = calculateHolePosition(
          note.frequency,
          note.holeDiameter,
          innerDiameter,
          temperature,
          calculationMethod,
          deltaAverage,
          effectiveLength
        )
        
        const shifted = shiftFollowingNotes(position, index, targetNotesBase)
        
        return { ...note, position: shifted }
      }
      return note
    })
  }, [targetNotesBase, effectiveLength, deltaAverage, innerDiameter, temperature, calculationMethod])

  // Memoiser baseNoteName
  const baseNoteName = useMemo(() => {
    return getClosestNote(note1Frequency).name
  }, [note1Frequency])

  // Add new target note
  const addTargetNote = () => {
    if (targetNotesBase.length < maxNotes) {
      const newNotes = generateTargetNotes(note1Frequency, targetNotesBase.length + 1)
      setTargetNotesBase(newNotes)
    }
  }

  // Update target note
  const updateTargetNote = (index, field, value) => {
    const updated = [...targetNotesBase]
    updated[index][field] = value
    setTargetNotesBase(updated)
  }

  // Add measured note (gain precision)
  const addMeasuredNote = (index) => {
    setCurrentMeasureIndex(index)
    setIsModalOpen(true)
  }

  const handleMeasureConfirm = (freq, diam) => {
    if (currentMeasureIndex !== null) {
      // Marquer la note comme mesuree
      const updated = [...targetNotesBase]
      updated[currentMeasureIndex].isMeasured = true
      updated[currentMeasureIndex].frequency = freq
      updated[currentMeasureIndex].holeDiameter = diam
      
      // Calculer le nouveau Delta a partir de la mesure
      const newDelta = calculateDeltaFromTwoNotes(
        note1Frequency,
        freq,
        temperature,
        calculationMethod
      )
      
      // Recalculer toutes les positions suivantes avec le nouveau Delta
      const recalculated = recalculatePositionsAfterMeasurement(
        currentMeasureIndex, 
        updated, 
        newDelta, 
        effectiveLength, 
        innerDiameter, 
        temperature, 
        calculationMethod
      )
      
      setTargetNotesBase(recalculated)
      setCurrentMeasureIndex(null)
    }
  }

  // Remove target note
  const removeTargetNote = (index) => {
    const updated = targetNotesBase.filter((_, i) => i !== index)
    setTargetNotesBase(updated)
  }

  // Change note by semitone (+1 or -1)
  const changeNoteSemitone = (index, direction) => {
    const updated = [...targetNotesBase]
    const currentNote = updated[index]
    
    // Find current note index in chromatic scale
    const currentNoteIndex = chromaticScale.indexOf(currentNote.noteName)
    
    // Calculate new note index (wraps around)
    const newNoteIndex = (currentNoteIndex + direction + 12) % 12
    const newNoteName = chromaticScale[newNoteIndex]
    
    // Calculate new frequency
    const currentOffset = index + 1
    const newOffset = currentOffset + direction
    const newFrequency = calculateFrequencyFromNote(note1Frequency, newOffset)
    
    // Update note
    updated[index] = {
      ...currentNote,
      noteName: newNoteName,
      frequency: parseFloat(newFrequency.toFixed(2))
    }
    setTargetNotesBase(updated)
  }

  // Reset note to default (5mm diameter, +1 semitone from previous)
  const resetNote = (index) => {
    const updated = [...targetNotesBase]
    const baseNote = getClosestNote(note1Frequency)
    
    // Calculate default values: +1 semitone per note from base
    const semitoneOffset = index + 1
    const nextNoteIndex = (baseNote.index + semitoneOffset) % 12
    const defaultNoteName = chromaticScale[nextNoteIndex]
    const defaultFrequency = calculateFrequencyFromNote(note1Frequency, semitoneOffset)
    
    // Reset note to defaults
    updated[index] = {
      ...updated[index],
      noteName: defaultNoteName,
      frequency: parseFloat(defaultFrequency.toFixed(2)),
      holeDiameter: 5,
      isMeasured: false
    }
    setTargetNotesBase(updated)
  }

  // Current inputs display for algorithm explanation
  const currentInputs = effectiveLength ? (
    <>
      <strong>{t('algo_current_inputs')}</strong><br />
      Lphys: {physicalLength} mm<br />
      Leff: {effectiveLength.toFixed(2)} mm<br />
      Delta: {deltaAverage?.toFixed(2)} mm<br />
      {t('algo_inner_diameter')} {innerDiameter} mm<br />
      {t('algo_temperature')} {temperature} ┬░C
    </>
  ) : null

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

      {/* STEP 1: Calculation Method */}
      <Step1CalculationMethod 
        calculationMethod={calculationMethod}
        onMethodChange={setCalculationMethod}
      />

      {/* STEP 2: Physical Measurements */}
      <Step2PhysicalMeasurements 
        physicalLength={physicalLength}
        setPhysicalLength={setPhysicalLength}
        innerDiameter={innerDiameter}
        setInnerDiameter={setInnerDiameter}
        temperature={temperature}
        setTemperature={setTemperature}
        note1Frequency={note1Frequency}
        setNote1Frequency={setNote1Frequency}
        note2Frequency={note2Frequency}
        setNote2Frequency={setNote2Frequency}
        effectiveLength={effectiveLength}
        deltaAverage={deltaAverage}
        baseNoteName={baseNoteName}
      />

      {/* STEP 3: Target Notes */}
      <Step3TargetNotes 
        targetNotes={targetNotes}
        minNotes={minNotes}
        maxNotes={maxNotes}
        physicalLength={physicalLength}
        onUpdateNote={updateTargetNote}
        onMeasureNote={addMeasuredNote}
        onRemoveNote={removeTargetNote}
        onAddNote={addTargetNote}
        onChangeNoteSemitone={changeNoteSemitone}
        onResetNote={resetNote}
      />

      {/* Measure Modal */}
      <MeasureModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setCurrentMeasureIndex(null)
        }}
        onConfirm={handleMeasureConfirm}
        initialFrequency={currentMeasureIndex !== null ? targetNotes[currentMeasureIndex]?.frequency : ''}
        initialDiameter={currentMeasureIndex !== null ? targetNotes[currentMeasureIndex]?.holeDiameter : ''}
      />
    </div>
  )
}

export default AcousticalPage
