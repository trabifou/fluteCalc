// Acoustic calculation utilities

// Note names for reference with semitones
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chromatic scale (index = semitones from C)
export const chromaticScale = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

// Get note name from frequency
export function getNoteName(frequency) {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  const halfSteps = 12 * Math.log2(frequency / C0);
  const noteIndex = Math.round(halfSteps) % 12;
  const octave = Math.floor(Math.round(halfSteps) / 12);
  
  return `${noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex]}${octave}`;
}

// Get the closest note (without octave) from a frequency
// Returns { name: 'D', index: 2 }
export function getClosestNote(frequency) {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  const halfSteps = 12 * Math.log2(frequency / C0);
  const noteIndex = Math.round(halfSteps) % 12;
  const adjustedIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
  
  return {
    name: chromaticScale[adjustedIndex],
    index: adjustedIndex
  };
}

// Calculate frequency for a note at given semitone offset from base frequency
export function calculateFrequencyFromNote(baseFrequency, semitoneOffset) {
  return baseFrequency * Math.pow(2, semitoneOffset / 12);
}

/**
 * Calculate semitone interval between two frequencies
 * Returns fractional semitones (e.g., 2.00, 2.34, 1.87)
 * @param {number} freq1 - Starting frequency (Hz)
 * @param {number} freq2 - Target frequency (Hz)
 * @returns {number} Interval in semitones
 */
export function calculateSemitoneInterval(freq1, freq2) {
  return 12 * Math.log2(freq2 / freq1);
}

/**
 * Analyze if frequency matches a chromatic note within tolerance
 * @param {number} frequency - Frequency to analyze (Hz)
 * @param {number} toleranceCents - Tolerance in cents (default: 10)
 * @returns {object} { isExact: boolean, cents: number, closestNote: string }
 */
export function analyzeFrequencyAccuracy(frequency, toleranceCents = 10) {
  const closestNote = getClosestNote(frequency);
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  
  // Calculate actual position in semitones from C0
  const actualSemitones = 12 * Math.log2(frequency / C0);
  const targetSemitones = Math.round(actualSemitones);
  
  // Calculate cents difference (1 semitone = 100 cents)
  const centsDiff = (actualSemitones - targetSemitones) * 100;
  
  return {
    isExact: Math.abs(centsDiff) <= toleranceCents,
    cents: centsDiff,
    closestNote: closestNote.name
  };
}

// Generate array of target notes starting from base frequency
// Each note is +1 semitone from the previous (chromatic scale)
export function generateTargetNotes(baseFrequency, numberOfNotes = 5) {
  const baseNote = getClosestNote(baseFrequency);
  const targetNotes = [];
  
  for (let i = 1; i <= numberOfNotes; i++) {
    // Get next note in chromatic scale (+i semitones from base)
    const nextNoteIndex = (baseNote.index + i) % 12;
    const nextNoteName = chromaticScale[nextNoteIndex];
    
    // Calculate frequency: +i semitones from base frequency
    const frequency = calculateFrequencyFromNote(baseFrequency, i);
    
    targetNotes.push({
      id: i,
      frequency: parseFloat(frequency.toFixed(2)),
      holeDiameter: 5,
      position: null,
      isMeasured: false,
      noteName: nextNoteName
    });
  }
  
  return targetNotes;
}

// Get note from semitones offset
export function getNoteFromSemitones(baseSemitones, offset) {
  const totalSemitones = (baseSemitones + offset) % 12;
  return noteNames[totalSemitones < 0 ? totalSemitones + 12 : totalSemitones];
}

// Calculate speed of sound based on temperature
export function calculateSpeedOfSound(temperature) {
  return (331.3 + 0.606 * temperature) * 1000; // mm/s
}

// Calculate end correction
// Formula from UNSW Physics: end correction = 0.6 × radius (NOT diameter)
// Reference: https://www.phys.unsw.edu.au/jw/fluteacoustics.html
export function calculateEndCorrection(diameter) {
  const radius = diameter / 2;
  return 0.6 * radius;
}

// Calculate effective length for a frequency
export function XcalculateEffectiveLength(frequency, speedOfSound, endCorrection) {
  return (speedOfSound / (2 * frequency)) - endCorrection;
}

// Calculate frequency from semitone offset
export function calculateFrequencyFromSemitone(baseFrequency, semitone) {
  return baseFrequency * Math.pow(2, semitone / 12);
}

// Available interval ratios for Sanfen Sunyi method
export const intervalRatios = [
  { name: 'Perfect Fifth (San Fen Sun Yi)', ratio: 3/2, semitones: 7 },
  { name: 'Perfect Fourth (San Fen Yi Yi)', ratio: 4/3, semitones: 5 },
  { name: 'Major Third', ratio: 5/4, semitones: 4 },
  { name: 'Minor Third', ratio: 6/5, semitones: 3 },
  { name: 'Major Second', ratio: 9/8, semitones: 2 },
  { name: 'Minor Second', ratio: 16/15, semitones: 1 },
  { name: 'Major Sixth', ratio: 5/3, semitones: 9 },
  { name: 'Minor Seventh', ratio: 16/9, semitones: 10 }
];

// Check if a hole pair should be excluded from overlap warnings
export function isSpecialHolePair(holeIndex, totalHoles) {
  if (totalHoles === 8) {
    if (holeIndex === 0) return true;
    if (holeIndex === 6) return true;
  }
  if (totalHoles === 7) {
    if (holeIndex === 5) return true;
  }
  return false;
}

// Calculate hole positions for a model
export function calculateHolePositions(model, baseFreq, diameter, temp) {
  const speedOfSound = calculateSpeedOfSound(temp);
  const endCorrection = calculateEndCorrection(diameter);
  
  const positions = [];
  const frequencies = [];
  
  for (let i = 0; i < model.intervals.length; i++) {
    const semitone = model.intervals[i];
    const frequency = calculateFrequencyFromSemitone(baseFreq, semitone);
    frequencies.push(frequency);
    
    const effectiveLength = XcalculateEffectiveLength(frequency, speedOfSound, endCorrection);
    positions.push(effectiveLength);
  }
  
  return { positions, frequencies };
}

// Calculate acoustical method positions
export function calculateAcousticalPositions(baseFreq, diameter, temp, numHoles) {
  const speedOfSound = calculateSpeedOfSound(temp);
  const endCorrection = calculateEndCorrection(diameter);
  
  const semitones = [2, 4, 5, 7, 9, 11, 12, 14];
  const results = [];
  
  for (let i = 0; i < numHoles; i++) {
    const semitone = semitones[i];
    const frequency = calculateFrequencyFromSemitone(baseFreq, semitone);
    const effectiveLength = XcalculateEffectiveLength(frequency, speedOfSound, endCorrection);
    const note = getNoteFromSemitones(2, semitone);
    
    results.push({
      hole: i + 1,
      position: effectiveLength,
      note,
      frequency
    });
  }
  
  return results;
}

// Calculate Benade method positions
export function calculateBenadePositions(length, boreDiameter, holeDiameter, wallThickness, numHoles) {
  const K = 0.25; // Empirical constant
  const holeRatio = holeDiameter / boreDiameter;
  const correctionFactor = 1 + K * Math.pow(holeRatio, 2);
  const chimneyCorrection = 0.75 * wallThickness;
  
  const semitones = [2, 4, 5, 7, 9, 11, 12, 14];
  const results = [];
  
  for (let i = 0; i < numHoles; i++) {
    const semitone = semitones[i];
    const ratio = 1 - Math.pow(2, -semitone / 12);
    const basicPosition = length * ratio;
    const correctedPosition = basicPosition * correctionFactor + chimneyCorrection;
    const note = getNoteFromSemitones(2, semitone);
    
    results.push({
      hole: i + 1,
      basicPosition,
      correctedPosition,
      note
    });
  }
  
  return results;
}

// ===== REVERSE ENGINEERING METHOD (Acoustical Page) =====

// Calculate effective length from measured frequency
// calculationMethod: 'half-wave' or 'quarter-wave'
export function calculateEffectiveLength(frequency, temperature, calculationMethod) {
  // TODO: Implement actual calculation
  // For now, return a constant
  const speedOfSound = calculateSpeedOfSound(temperature);
  
  if (calculationMethod === 'half-wave') {
    // L_eff = c / (2 * f0)
    return speedOfSound / (2 * frequency);
  } else {
    // quarter-wave: L_eff = c / (4 * f0)
    return speedOfSound / (4 * frequency);
  }
}

/**
 * Calculate Delta (end correction) from a measured hole
 * Inverse problem: Given measured frequency and known hole position → calculate actual delta
 * This is more accurate than empirical formulas because it uses real drilled hole data
 * @param {number} measuredFreq - Measured frequency at the hole (Hz)
 * @param {number} holePositionFromBase - Position where hole was drilled, measured from base (mm)
 * @param {number} holeDiameter - Measured hole diameter (mm)
 * @param {number} physicalLength - Physical tube length (mm)
 * @param {number} innerDiameter - Inner bore diameter (mm)
 * @param {number} wallThickness - Wall thickness (mm)
 * @param {number} temperature - Temperature (°C)
 * @param {string} calculationMethod - 'half-wave' or 'quarter-wave'
 * @returns {number} Calculated delta (mm)
 */
export function calculateDeltaFromMeasuredHole(
  measuredFreq,
  holePositionFromBase,
  holeDiameter,
  physicalLength,
  innerDiameter,
  wallThickness,
  temperature,
  calculationMethod
) {
  const speedOfSound = calculateSpeedOfSound(temperature);
  
  // Calculate acoustic position from blowing edge (inverse of display coordinate)
  const acousticPositionFromBlowingEdge = physicalLength - holePositionFromBase;
  
  // Calculate base acoustic length from measured frequency
  let baseLength;
  if (calculationMethod === 'half-wave') {
    baseLength = speedOfSound / (2 * measuredFreq);
  } else {
    baseLength = speedOfSound / (4 * measuredFreq);
  }
  
  // Calculate hole size corrections (same as in calculateHolePosition)
  const holeSizeRatio = holeDiameter / innerDiameter;
  const alpha = 0.75 + 0.5 * holeSizeRatio; // Alpha coefficient
  const holeEndCorrection = alpha * (holeDiameter / 2);
  
  // Chimney correction (wall thickness effect)
  const chimneyCorrection = 0.75 * wallThickness;
  
  // Solve for delta: baseLength = acousticPosition + delta + corrections
  // Therefore: delta = baseLength - acousticPosition - corrections
  const delta = baseLength - acousticPositionFromBlowingEdge - holeEndCorrection - chimneyCorrection;
  
  // Validation: Delta should be within reasonable bounds
  // Empirical delta is ~0.6 * radius for half-wave, ~1.0 * radius for quarter-wave
  const empiricalDelta = calculationMethod === 'half-wave' 
    ? 0.6 * (innerDiameter / 2) 
    : 1.0 * (innerDiameter / 2);
  
  const minDelta = empiricalDelta * 0.2; // 20% of empirical
  const maxDelta = empiricalDelta * 3.0; // 300% of empirical
  
  if (delta < minDelta || delta > maxDelta) {
    console.warn(
      `Warning: Calculated delta (${delta.toFixed(2)}mm) is outside expected range ` +
      `[${minDelta.toFixed(2)} - ${maxDelta.toFixed(2)}mm]. ` +
      `Check measurement accuracy or hole position.`
    );
  }
  
  return delta;
}

// Calculate hole position for a target note
// Includes corrections for hole diameter and wall thickness (chimney effect)
// Returns position FROM BASE (what users measure), not from blowing edge
export function calculateHolePosition(
  targetFrequency,
  holeDiameter,
  innerDiameter,
  temperature,
  calculationMethod,
  delta,
  wallThickness = 3,  // Default 3mm if not provided
  physicalLength      // Physical length of the flute (needed to convert to position from base)
) {
  const speedOfSound = calculateSpeedOfSound(temperature);
  
  // Calculate base effective length for target frequency
  let baseLength;
  if (calculationMethod === 'half-wave') {
    baseLength = speedOfSound / (2 * targetFrequency);
  } else {
    baseLength = speedOfSound / (4 * targetFrequency);
  }
  
  // Calculate hole correction factor
  // Larger holes create more end correction
  const holeSizeRatio = holeDiameter / innerDiameter;
  
  // Alpha coefficient varies with size ratio (empirical)
  // Small holes (d/D < 0.3): α ≈ 0.75
  // Large holes (d/D > 0.5): α ≈ 1.0
  const alpha = 0.75 + 0.5 * holeSizeRatio;
  
  // Hole end correction
  const holeEndCorrection = alpha * (holeDiameter / 2);
  
  // Chimney height correction (wall thickness adds acoustic length)
  const chimneyCorrection = 0.75 * wallThickness;
  
  // Total correction
  const totalCorrection = delta + holeEndCorrection + chimneyCorrection;
  
  // Position from blowing edge (acoustic calculation)
  const positionFromBlowingEdge = baseLength - totalCorrection;
  
  // Validation: position from blowing edge should be positive
  if (positionFromBlowingEdge <= 0) {
    console.error('Error: Calculated negative position from blowing edge. Check parameters.');
    return 0;
  }
  
  // Convert to position from base (what users actually measure)
  const positionFromBase = physicalLength - positionFromBlowingEdge;
  
  // Validation: position from base should be positive and within flute length
  if (positionFromBase <= 0) {
    console.warn('Warning: Hole position is beyond the blowing edge. Check parameters.');
    return 0;
  }
  
  if (positionFromBase >= physicalLength) {
    console.warn('Warning: Hole position is beyond the base. Check parameters.');
    return physicalLength;
  }
  
  return positionFromBase;
}

// Recalculate all positions after a measurement
// Uses the new delta measured from actual frequency to improve accuracy of following holes
export function recalculatePositionsAfterMeasurement(
  measurementIndex,
  targetNotes,
  newDelta,
  effectiveLength,
  innerDiameter,
  temperature,
  calculationMethod,
  wallThickness = 3,
  physicalLength  // Required to calculate positions from base
) {
  console.log('Recalculating positions after measurement at index:', measurementIndex);
  console.log('New Delta:', newDelta);
  
  return targetNotes.map((note, index) => {
    // Don't recalculate measured notes - they are locked to physical reality
    if (note.isMeasured) {
      return note;
    }
    
    // Don't recalculate notes before the measurement point
    // (they were already calculated with previous data)
    if (index <= measurementIndex) {
      return note;
    }
    
    // Recalculate position for unmeasured notes after the measurement
    // Using the new, more accurate delta
    const newPosition = calculateHolePosition(
      note.frequency,
      note.holeDiameter,
      innerDiameter,
      temperature,
      calculationMethod,
      newDelta,  // Use the improved delta from measurement
      wallThickness,
      physicalLength
    );
    
    // Apply shift based on hole interactions (coupling effects)
    const shifted = shiftFollowingNotes(newPosition, index, targetNotes);
    
    return { ...note, position: shifted };
  });
}

/**
 * Validate Step 2 parameters by checking if first notes have valid positions
 * Checks the first 5 notes (or fewer if less than 5 notes total)
 * @param {Array} targetNotes - Array of target notes with positions
 * @param {number} physicalLength - Physical length of the flute (mm)
 * @returns {boolean} True if all checked notes have valid positions (> 0 and < physicalLength)
 */
export function validateStep2Parameters(targetNotes, physicalLength) {
  if (!targetNotes || targetNotes.length === 0) {
    return true; // No notes to validate yet
  }
  
  // Check first 5 notes or all notes if fewer than 5
  const notesToCheck = Math.min(5, targetNotes.length);
  
  for (let i = 0; i < notesToCheck; i++) {
    const note = targetNotes[i];
    
    // Invalid if position is null, undefined, <= 0, or >= physicalLength
    if (!note.position || note.position <= 0 || note.position >= physicalLength) {
      return false;
    }
  }
  
  return true;
}

// Shift following note positions based on previous holes (acoustic coupling)
// Based on Benade/Nederveen: adjacent holes create acoustic coupling
// Coupling strength decreases exponentially with distance
export function shiftFollowingNotes(basePosition, noteIndex, allNotes) {
  if (noteIndex === 0) {
    return basePosition; // First hole has no previous holes to couple with
  }
  
  let cumulativeShift = 0;
  const DECAY_CONSTANT = 50; // mm - coupling effect decays over ~50mm distance
  const MAX_SHIFT_PER_HOLE = 3; // mm - maximum shift from one hole
  const REFERENCE_DIAMETER = 5; // mm - reference hole diameter for normalization
  
  // Calculate cumulative shift from all previous holes
  for (let i = 0; i < noteIndex; i++) {
    const prevHole = allNotes[i];
    
    // Skip if previous hole doesn't have a position yet
    if (!prevHole.position) {
      continue;
    }
    
    // Calculate spacing between current position and previous hole
    const spacing = Math.abs(basePosition - prevHole.position);
    
    // Coupling factor decreases exponentially with distance
    // exp(-spacing/decay) gives strong coupling for close holes, weak for distant
    const couplingFactor = Math.exp(-spacing / DECAY_CONSTANT);
    
    // Larger holes create stronger coupling (normalized to 5mm reference)
    const holeSizeFactor = prevHole.holeDiameter / REFERENCE_DIAMETER;
    
    // Cumulative shift from this hole
    const holeShift = holeSizeFactor * couplingFactor * MAX_SHIFT_PER_HOLE;
    cumulativeShift += holeShift;
  }
  
  return basePosition + cumulativeShift;
}

