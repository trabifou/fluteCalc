// Generate SVG drawing of the flute
export function generateFluteSVG(fluteData) {
  const { positions, numHoles, diameter } = fluteData;
  
  // Calculate SVG dimensions
  const maxPosition = Math.max(...positions);
  const fluteLength = maxPosition + 50;
  
  // SVG scaling factor (pixels per mm)
  const scale = 1.5;
  const svgHeight = fluteLength * scale;
  const svgWidth = 300;
  
  // Flute tube dimensions
  const tubeWidth = diameter * scale;
  const tubeX = (svgWidth - tubeWidth) / 2;
  
  // Default hole diameter (8mm)
  const holeRadius = 4 * scale;
  
  let holesContent = '';
  
  // Draw holes
  for (let i = 0; i < numHoles; i++) {
    const position = positions[i] * scale;
    let holeX = svgWidth / 2;
    
    let isBackHole = false;
    let isPinkyHole = false;
    
    if (numHoles === 8) {
      if (i === 0) {
        holeX = svgWidth / 2 + tubeWidth / 2 - 5;
        isPinkyHole = true;
      } else if (i === 7) {
        holeX = svgWidth / 2 - tubeWidth / 2 - 5;
        isBackHole = true;
      }
    } else if (numHoles === 7 && i === 6) {
      holeX = svgWidth / 2 - tubeWidth / 2 - 5;
      isBackHole = true;
    }
    
    // Draw hole
    holesContent += `
      <circle cx="${holeX}" cy="${position}" r="${holeRadius}" 
              fill="${isBackHole ? '#4a5d4a' : '#3e2723'}" 
              stroke="${isBackHole || isPinkyHole ? '#ff6b6b' : '#2d1f1a'}" 
              stroke-width="2"/>
    `;
    
    // Label
    let label = `Trou ${i + 1}`;
    if (isBackHole) label += ' (dos)';
    if (isPinkyHole) label += ' (auriculaire)';
    
    const labelX = holeX + holeRadius + 15;
    holesContent += `
      <text x="${labelX}" y="${position + 4}" font-size="11" fill="#3e2723">
        ${label}
      </text>
      <text x="${labelX}" y="${position + 16}" font-size="9" fill="#6d5738" font-style="italic">
        ${positions[i].toFixed(1)} mm
      </text>
    `;
    
    // Draw distance lines between holes
    if (i < numHoles - 1) {
      const nextPosition = positions[i + 1] * scale;
      const midY = (position + nextPosition) / 2;
      const lineX = tubeX - 20;
      const distance = Math.abs(positions[i] - positions[i + 1]);
      
      holesContent += `
        <line x1="${lineX}" y1="${position}" x2="${lineX}" y2="${nextPosition}" 
              stroke="#8b6f47" stroke-width="1" stroke-dasharray="2,2"/>
        <line x1="${lineX - 3}" y1="${position}" x2="${lineX + 3}" y2="${position}" 
              stroke="#8b6f47" stroke-width="1"/>
        <line x1="${lineX - 3}" y1="${nextPosition}" x2="${lineX + 3}" y2="${nextPosition}" 
              stroke="#8b6f47" stroke-width="1"/>
        <text x="${lineX - 5}" y="${midY}" font-size="9" fill="#6d5738" text-anchor="end">
          ${distance.toFixed(1)}mm
        </text>
      `;
    }
  }
  
  return `
    <svg class="flute-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="20" height="100">
          <path d="M0,0 Q10,50 0,100" stroke="#8b6f47" stroke-width="0.5" fill="none" opacity="0.3"/>
          <path d="M10,0 Q20,50 10,100" stroke="#8b6f47" stroke-width="0.5" fill="none" opacity="0.3"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="${svgWidth}" height="${svgHeight}" fill="#f5e6d3"/>
      
      <!-- Flute tube -->
      <rect x="${tubeX}" y="0" width="${tubeWidth}" height="${svgHeight}" 
            fill="#d4b896" stroke="#8b6f47" stroke-width="2" rx="5"/>
      
      <!-- Wood grain effect -->
      <rect x="${tubeX}" y="0" width="${tubeWidth}" height="${svgHeight}" 
            fill="url(#woodGrain)" opacity="0.3" rx="5"/>
      
      <!-- Blowing edge (embouchure) -->
      <ellipse cx="${svgWidth / 2}" cy="20" rx="${tubeWidth / 2 + 5}" ry="10" 
               fill="#6d5738" stroke="#5d4a37" stroke-width="2"/>
      <text x="${svgWidth / 2}" y="50" text-anchor="middle" font-size="12" fill="#3e2723" font-weight="bold">
        Embouchure
      </text>
      
      ${holesContent}
    </svg>
  `;
}
