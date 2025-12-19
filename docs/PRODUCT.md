# Product Documentation

## What is Flute Crafting Calculator?

A web application for **calculating precise hole positions** when crafting traditional wind instruments, specifically focused on wood flutes. The tool bridges ancient musical traditions with modern acoustic physics, helping makers achieve accurate tuning without expensive measurement equipment.

## Target Users

- **Instrument makers** crafting bamboo/wooden flutes from scratch
- **Luthiers** experimenting with new scale designs
- **Music students** learning about acoustic physics and instrument design
- **Traditional craftspeople** modernizing ancient techniques

## Core Functionality

### Three Calculation Methods

The app provides three distinct approaches to solve the same problem: "Where should I drill holes to achieve specific musical notes?"

#### 1. Xiao - Sanfen Sunyi Method

**Origin**: Ancient Chinese mathematical system (三分损益法)  
**Best for**: Traditional pentatonic scales, historical authenticity

**How it works**:
1. User specifies base frequency (fundamental note of the bamboo)
2. Choose number of holes (4-8)
3. Select traditional scale model (pentatonic, heptatonic, diatonic)
4. System calculates positions using 3:2 and 4:3 interval ratios
5. Includes acoustic correction based on bore diameter

**Unique features**:
- Pre-configured traditional scale models
- Historical context and explanations
- Temperature compensation

#### 2. Acoustical Physics Method (Reverse Engineering)

**Origin**: Modern acoustic physics  
**Best for**: Precision tuning, experimentation, reverse engineering existing flutes

**Workflow**:

**Step 1**: Choose tube type
- Half-wave (open tube) - both ends open
- Quarter-wave (closed tube) - one end closed

**Step 2**: Physical measurements
- Physical length (Lphys)
- Inner diameter (Dinner)
- Ambient temperature
- Base note frequency (measure with tuner)
- Optional: Second frequency for end correction

**Automatic calculations**:
- Effective length (Leff) from measured frequency
- Delta (end correction) from two measurements or estimated from diameter

**Step 3**: Target notes configuration
- Add 5-10 holes (depends on tube type)
- Each hole: target frequency + hole diameter
- System calculates position from blowing edge
- **Real-time recalculation** - no "Calculate" button needed

**Measurement workflow**:
1. Calculate theoretical position
2. Drill hole at calculated position
3. Click "M" (Measure) button
4. Enter actual measured frequency + diameter
5. System recalculates all following holes based on real data
6. Cascading corrections improve accuracy

**Key insight**: Combines theory with empirical feedback loop

#### 3. Benade's Formula

**Origin**: Dr. Arthur Benade's woodwind research  
**Best for**: Western orchestral instruments, scientific accuracy

**Parameters**:
- Fundamental length
- Bore diameter
- Hole diameter
- Wall thickness

**Use case**: More technical, suited for experimental instrument design

### Cross-Cutting Features

#### Bilingual Support (FR/EN)
- Toggle between French and English
- Preference saved in browser
- All UI labels, hints, and explanations translated

#### Flute Visualization
- SVG diagram showing calculated hole positions
- Proportional scaling
- Measurements labeled

#### Algorithm Explanations
- Collapsible theory sections
- Mathematical formulas displayed
- Educational context for each method

#### Measurement Guide
- Step-by-step instructions for measuring flutes
- Illustrations (placeholders for future images)
- Tips for accuracy (precision tools, environmental conditions)

## User Experience Design

### Visual Theme

**Parchment & Wood aesthetic**:
- Warm brown tones (#5d4a37, #6d5738)
- Cream backgrounds (#fffcf7)
- Beige calculated value sections (#e8dcc8)
- Serif typography (Georgia, Palatino)

**Goal**: Evoke traditional craftsmanship while maintaining modern usability

### Design Principles

1. **Instant feedback**: All calculations update in real-time via useMemo hooks
2. **Progressive disclosure**: Collapsible sections (algorithm explanations, measurement guides)
3. **Inline units**: Measurement units (mm, Hz, °C) appear inside input fields
4. **Icon buttons**: Compact 36×36px squares for actions (M=Measure, ↻=Reset, ✓=Measured)
5. **Mobile responsive**: Adapts to phone/tablet screens

### Workflow Philosophy

**No validation gatekeeping** - The old version required clicking "Calculate" buttons at each step. Current version removes friction:

- Change any input → See results instantly
- Add/remove notes → Table updates immediately
- Measure actual values → Following holes recalculate automatically

**Trust the user** - No hand-holding, direct access to all parameters

## Technical Features

### Performance Optimizations

- **useMemo calculations**: Avoid unnecessary recalculations
- **React 19**: Latest performance improvements
- **Vite HMR**: Instant dev feedback
- **Pure functions**: Calculation engine is stateless

### Data Persistence

- **Language preference**: Saved in localStorage
- **No calculation history**: Each session is independent (design choice for simplicity)
- **No user accounts**: Fully client-side application

### Browser Requirements

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript enabled
- localStorage access
- No mobile app (responsive web app only)

## Unique Value Propositions

### vs. Spreadsheet Calculators
✅ Real-time updates  
✅ Visual diagrams  
✅ Measurement feedback loop  
✅ Multiple methods in one tool  
✅ Bilingual  

### vs. Commercial Software
✅ Free and open source  
✅ No installation  
✅ Works offline (after first load)  
✅ No ads or data collection  

### vs. Traditional Methods (trial and error)
✅ Scientific accuracy  
✅ Saves material (fewer mistakes)  
✅ Educational (shows formulas)  
✅ Reproducible results  

## Future Enhancements (Not Implemented)

Potential features mentioned in code comments or design discussions:

- **Save/load projects**: Export calculations as JSON
- **Hole shape calculator**: Beyond simple circular holes
- **Tuning curve analysis**: Visualize intonation across register
- **3D printable templates**: Export SVG as drilling guides
- **Photo uploads**: Replace placeholder images in measurement guide
- **Database of bamboo**: Common dimensions for different species
- **Community scale library**: Share custom scale designs

## Accessibility

**Current state**:
- Keyboard navigation supported (tab through inputs)
- Focus indicators on inputs
- Semantic HTML structure
- No screen reader optimization yet

**Limitations**:
- No ARIA labels
- No high-contrast mode
- Color-dependent status indicators (Measure buttons)

## Known Limitations

1. **Position measurements**: Always from blowing edge (could confuse users expecting "from bottom")
2. **Chromatic scale only**: No quarter-tone or microtonal support
3. **Single-bore**: Doesn't handle conical bores or complex geometries
4. **No hole angle**: Assumes perpendicular drilling
5. **Temperature range**: -10°C to 40°C (edge cases not validated)

## Support & Documentation

- **In-app help**: Algorithm explanation sections
- **Measurement guide**: Built into Step 2
- **Source code**: Comments in `calculations.js` explain formulas
- **README**: Basic setup instructions
