/**
 * Tests for acoustic calculations
 * Following TDD principles: Write failing tests first (RED), then implement (GREEN)
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSpeedOfSound,
  calculateEndCorrection,
  calculateDeltaFromMeasuredHole,
  calculateHolePosition,
  calculateEffectiveLength,
} from './calculations.js';

describe('Acoustic Calculations - TDD Implementation', () => {
  
  // =================================================================
  // PHASE 1: END CORRECTION BUG (CRITICAL)
  // Expected: FAILING initially (uses diameter instead of radius)
  // =================================================================
  
  describe('calculateEndCorrection', () => {
    it('should use radius (diameter/2) not diameter - UNSW Physics formula', () => {
      // End correction = 0.6 × radius
      // For 19mm diameter: 0.6 × 9.5 = 5.7mm (NOT 11.4mm)
      const correction19mm = calculateEndCorrection(19);
      expect(correction19mm).toBeCloseTo(5.7, 1);
    });

    it('should calculate correctly for 15mm diameter', () => {
      // For 15mm diameter: 0.6 × 7.5 = 4.5mm
      const correction15mm = calculateEndCorrection(15);
      expect(correction15mm).toBeCloseTo(4.5, 1);
    });

    it('should calculate correctly for 25mm diameter', () => {
      // For 25mm diameter: 0.6 × 12.5 = 7.5mm
      const correction25mm = calculateEndCorrection(25);
      expect(correction25mm).toBeCloseTo(7.5, 1);
    });

    it('should scale linearly with diameter', () => {
      // Doubling diameter should double end correction
      const correction10mm = calculateEndCorrection(10);
      const correction20mm = calculateEndCorrection(20);
      expect(correction20mm / correction10mm).toBeCloseTo(2.0, 2);
    });

    it('should return positive values', () => {
      expect(calculateEndCorrection(15)).toBeGreaterThan(0);
      expect(calculateEndCorrection(25)).toBeGreaterThan(0);
    });
  });

  // =================================================================
  // VALIDATION: SPEED OF SOUND (Should PASS - already correct)
  // =================================================================
  
  describe('calculateSpeedOfSound', () => {
    it('should match UNSW Physics formula: 331.3 + 0.606×T in mm/s', () => {
      // At 20°C: (331.3 + 0.606×20) × 1000 = 343,420 mm/s
      expect(calculateSpeedOfSound(20)).toBeCloseTo(343420, 0);
    });

    it('should calculate correctly at 0°C', () => {
      // At 0°C: 331.3 × 1000 = 331,300 mm/s
      expect(calculateSpeedOfSound(0)).toBeCloseTo(331300, 0);
    });

    it('should calculate correctly at 30°C', () => {
      // At 30°C: (331.3 + 0.606×30) × 1000 = 349,480 mm/s
      expect(calculateSpeedOfSound(30)).toBeCloseTo(349480, 0);
    });

    it('should increase with temperature', () => {
      const speed0 = calculateSpeedOfSound(0);
      const speed20 = calculateSpeedOfSound(20);
      const speed40 = calculateSpeedOfSound(40);
      
      expect(speed20).toBeGreaterThan(speed0);
      expect(speed40).toBeGreaterThan(speed20);
    });
  });

  // =================================================================
  // PHASE 2: DELTA FROM MEASURED HOLE (INVERSE PROBLEM)
  // Tests the new method that calculates delta from actual drilled holes
  // =================================================================
  
  describe('calculateDeltaFromMeasuredHole', () => {
    it('should calculate delta from measured hole frequency and position - half-wave', () => {
      // Scenario: User drilled a hole at 350mm from base (100mm from blowing edge)
      // Measured frequency: 440 Hz (A4)
      // Hole diameter: 8mm
      // Physical length: 450mm
      const measuredFreq = 440;
      const holePositionFromBase = 350; // 100mm from blowing edge
      const holeDiameter = 8;
      const physicalLength = 450;
      const innerDiameter = 20;
      const wallThickness = 3;
      const temperature = 20;
      const method = 'half-wave';
      
      const delta = calculateDeltaFromMeasuredHole(
        measuredFreq,
        holePositionFromBase,
        holeDiameter,
        physicalLength,
        innerDiameter,
        wallThickness,
        temperature,
        method
      );
      
      // Delta should be positive
      expect(delta).toBeGreaterThan(0);
      
      // Should be reasonable (2-30mm range for typical flutes)
      expect(delta).toBeGreaterThan(2);
      expect(delta).toBeLessThan(30);
    });

    it('should calculate delta for quarter-wave method', () => {
      const measuredFreq = 220; // Lower frequency for closed tube
      const holePositionFromBase = 350;
      const holeDiameter = 8;
      const physicalLength = 450;
      const innerDiameter = 20;
      const wallThickness = 3;
      const temperature = 20;
      const method = 'quarter-wave';
      
      const delta = calculateDeltaFromMeasuredHole(
        measuredFreq,
        holePositionFromBase,
        holeDiameter,
        physicalLength,
        innerDiameter,
        wallThickness,
        temperature,
        method
      );
      
      expect(delta).toBeGreaterThan(0);
      expect(delta).toBeLessThan(50);
    });

    it('should give different results for different hole positions', () => {
      const measuredFreq = 440;
      const holeDiameter = 8;
      const physicalLength = 450;
      const innerDiameter = 20;
      const wallThickness = 3;
      const temperature = 20;
      const method = 'half-wave';
      
      // Hole at 350mm from base
      const delta1 = calculateDeltaFromMeasuredHole(
        measuredFreq, 350, holeDiameter, physicalLength, 
        innerDiameter, wallThickness, temperature, method
      );
      
      // Hole at 300mm from base (further from embouchure)
      const delta2 = calculateDeltaFromMeasuredHole(
        measuredFreq, 300, holeDiameter, physicalLength,
        innerDiameter, wallThickness, temperature, method
      );
      
      // Different positions should give different deltas
      expect(delta1).not.toBe(delta2);
    });

    it('should handle temperature variations', () => {
      const measuredFreq = 440;
      const holePositionFromBase = 350;
      const holeDiameter = 8;
      const physicalLength = 450;
      const innerDiameter = 20;
      const wallThickness = 3;
      const method = 'half-wave';
      
      const delta20C = calculateDeltaFromMeasuredHole(
        measuredFreq, holePositionFromBase, holeDiameter,
        physicalLength, innerDiameter, wallThickness, 20, method
      );
      
      const delta30C = calculateDeltaFromMeasuredHole(
        measuredFreq, holePositionFromBase, holeDiameter,
        physicalLength, innerDiameter, wallThickness, 30, method
      );
      
      // Temperature affects speed of sound, so delta should differ
      expect(delta20C).not.toBe(delta30C);
    });
  });

  // =================================================================
  // PHASE 3: HOLE POSITION WITH CORRECTIONS (HIGH PRIORITY)
  // Expected: FAILING initially (missing hole diameter corrections)
  // =================================================================
  
  describe('calculateHolePosition', () => {
    it('should account for hole diameter - larger holes closer to embouchure', () => {
      const targetFreq = 440; // A4
      const innerDiam = 19;
      const temperature = 20;
      const method = 'half-wave';
      const delta = 5.7; // Corrected end correction for 19mm
      const wallThickness = 3;
      
      // 8mm hole
      const pos8mm = calculateHolePosition(
        targetFreq, 8, innerDiam, temperature, method, delta, wallThickness
      );
      
      // 12mm hole (larger)
      const pos12mm = calculateHolePosition(
        targetFreq, 12, innerDiam, temperature, method, delta, wallThickness
      );
      
      // Larger hole should be positioned closer to embouchure (smaller position)
      expect(pos12mm).toBeLessThan(pos8mm);
      
      // Difference should be noticeable (at least 2mm)
      expect(pos8mm - pos12mm).toBeGreaterThan(2);
    });

    it('should account for wall thickness (chimney correction)', () => {
      const targetFreq = 440;
      const holeDiam = 8;
      const innerDiam = 19;
      const temperature = 20;
      const method = 'half-wave';
      const delta = 5.7;
      
      // 2mm wall
      const pos2mm = calculateHolePosition(
        targetFreq, holeDiam, innerDiam, temperature, method, delta, 2
      );
      
      // 5mm wall (thicker)
      const pos5mm = calculateHolePosition(
        targetFreq, holeDiam, innerDiam, temperature, method, delta, 5
      );
      
      // Thicker wall should shift position
      expect(pos2mm).not.toBe(pos5mm);
    });

    it('should return positive positions', () => {
      const targetFreq = 440;
      const holeDiam = 8;
      const innerDiam = 19;
      const temperature = 20;
      const method = 'half-wave';
      const delta = 5.7;
      const wallThickness = 3;
      
      const position = calculateHolePosition(
        targetFreq, holeDiam, innerDiam, temperature, method, delta, wallThickness
      );
      
      expect(position).toBeGreaterThan(0);
    });

    it('should give different positions for different frequencies', () => {
      const holeDiam = 8;
      const innerDiam = 19;
      const temperature = 20;
      const method = 'half-wave';
      const delta = 5.7;
      const wallThickness = 3;
      
      const posA4 = calculateHolePosition(
        440, holeDiam, innerDiam, temperature, method, delta, wallThickness
      );
      
      const posD5 = calculateHolePosition(
        587, holeDiam, innerDiam, temperature, method, delta, wallThickness
      );
      
      // Higher frequency should be closer to embouchure
      expect(posD5).toBeLessThan(posA4);
    });

    it('should handle half-wave vs quarter-wave differently', () => {
      const targetFreq = 220;
      const holeDiam = 8;
      const innerDiam = 19;
      const temperature = 20;
      const delta = 5.7;
      const wallThickness = 3;
      
      const posHalf = calculateHolePosition(
        targetFreq, holeDiam, innerDiam, temperature, 'half-wave', delta, wallThickness
      );
      
      const posQuarter = calculateHolePosition(
        targetFreq, holeDiam, innerDiam, temperature, 'quarter-wave', delta, wallThickness
      );
      
      // Quarter-wave has shorter effective length (c/4f vs c/2f)
      // So position should be less than half-wave
      expect(posQuarter).toBeLessThan(posHalf);
    });
  });

  // =================================================================
  // VALIDATION: EFFECTIVE LENGTH (Should work - already implemented)
  // =================================================================
  
  describe('calculateEffectiveLength', () => {
    it('should calculate half-wave effective length correctly', () => {
      const frequency = 440; // A4
      const temperature = 20;
      const speedOfSound = calculateSpeedOfSound(temperature); // 343,420 mm/s
      
      // Half-wave: L_eff = c / (2f) = 343,420 / 880 = 390.25mm
      const Leff = calculateEffectiveLength(frequency, temperature, 'half-wave');
      expect(Leff).toBeCloseTo(390.25, 1);
    });

    it('should calculate quarter-wave effective length correctly', () => {
      const frequency = 220; // A3
      const temperature = 20;
      
      // Quarter-wave: L_eff = c / (4f) = 343,420 / 880 = 390.25mm
      const Leff = calculateEffectiveLength(frequency, temperature, 'quarter-wave');
      expect(Leff).toBeCloseTo(390.25, 1);
    });

    it('should give quarter-wave HALF the half-wave length at same frequency', () => {
      const frequency = 440;
      const temperature = 20;
      
      const halfWave = calculateEffectiveLength(frequency, temperature, 'half-wave');
      const quarterWave = calculateEffectiveLength(frequency, temperature, 'quarter-wave');
      
      // Quarter-wave = c/(4f), Half-wave = c/(2f)
      // So quarter-wave should be HALF of half-wave
      expect(quarterWave / halfWave).toBeCloseTo(0.5, 1);
    });
  });
});
