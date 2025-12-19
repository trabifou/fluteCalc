# Contributing Guidelines

## Development Setup

```bash
# Clone and install
git clone <repository-url>
cd flutecalc
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint check
npm run lint
```

**Requirements**: Node.js 18+ (React 19 requires modern Node)

## Code Style Conventions

### React Patterns

✅ **DO**: Functional components with hooks only
```jsx
function MyComponent({ value, onChange }) {
  const [state, setState] = useState(initialValue)
  // ...
}
```

❌ **DON'T**: Class components (not used in this codebase)

✅ **DO**: useMemo for calculations
```jsx
const result = useMemo(() => 
  expensiveCalculation(input1, input2),
  [input1, input2]
)
```

❌ **DON'T**: Separate "Calculate" buttons (breaks reactive pattern)

### Component Organization

**File naming**: `PascalCase.jsx` for components, `camelCase.js` for utilities  
**One component per file**: Except tiny helper components  
**Props order**: `{ value, onChange, ...otherProps }` (controlled inputs first)

### Styling Guidelines

✅ **DO**: Use InputGroup for all numeric inputs with units
```jsx
<InputGroup label={t('label_key')} unit="mm">
  <input type="number" style={{ paddingRight: '35px' }} />
</InputGroup>
```

❌ **DON'T**: Put units in translation labels (they go in `unit` prop)

✅ **DO**: Use CSS variables from `src/index.css`
```jsx
style={{ color: 'var(--wood-dark)' }}
```

❌ **DON'T**: Hardcode colors (except one-off values)

✅ **DO**: Inline styles for dynamic/hover behavior
```jsx
<button style={{
  background: 'linear-gradient(135deg, #8b6f47 0%, #6d5738 100%)',
  // ... hover states via onMouseEnter/Leave
}}>
```

❌ **DON'T**: Create CSS files for simple components

### Translation Workflow

1. Add key to both `src/i18n/locales/en.json` and `fr.json`
2. Use `t('key')` in component via `useTranslation()` hook
3. **Never include units in labels** (handled by InputGroup)

```jsx
// In component
const { t } = useTranslation()
<InputGroup label={t('step2_lphys')} unit="mm">
```

```json
// In en.json and fr.json
"step2_lphys": "Physical Length"  // ✅ No (mm)
```

### Calculation Functions

✅ **DO**: Pure functions in `src/utils/calculations.js`
```javascript
export function calculateEffectiveLength(frequency, temperature, method) {
  const v = calculateSpeedOfSound(temperature)
  return method === 'half-wave' ? v / (2 * frequency) : v / (4 * frequency)
}
```

❌ **DON'T**: Side effects or component state in calculation utilities

### Number Input Patterns

Always disable spinners (already in `index.css` globally):
```css
input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
input[type="number"] { -moz-appearance: textfield; }
```

Always include padding-right when using InputGroup with units:
```jsx
style={{ paddingRight: '35px' }} // Makes room for unit display
```

## Testing Approach

**Current state**: No automated tests (manual testing only)

**If adding tests** (future):
- Use Vitest (Vite's test runner)
- Test calculation functions (`calculations.js`) first
- Component tests secondary
- No E2E tests needed (simple UI)

## Browser Testing

**Primary targets**: Chrome, Firefox, Safari (latest versions)  
**Mobile**: iOS Safari, Chrome Android  
**Not supported**: IE11, older mobile browsers

## Git Workflow

1. Create feature branch: `feature/description` or `fix/description`
2. Make focused commits (one logical change per commit)
3. Test manually before pushing
4. No commit message conventions enforced (use clear descriptions)

## PR Guidelines

- **Keep PRs small**: One feature/fix per PR
- **Update translations**: Both EN and FR if touching UI text
- **Check visual consistency**: Beige theme, inline units, button sizes
- **Test all three calculation methods**: Changes to shared components affect all pages

## Common Pitfalls

❌ Adding units to translation labels  
❌ Forgetting `paddingRight: '35px'` on inputs with units  
❌ Using class components or legacy React patterns  
❌ Creating "Calculate" buttons (breaks instant update UX)  
❌ Hardcoding colors instead of using CSS variables  
❌ Modifying `old/` folder (it's legacy reference code)

## File Organization Rules

- **Components**: Group by feature (e.g., `AcousticalSteps/`) not by type
- **Shared components**: Top-level `components/` (InputGroup, Layout)
- **Utils**: Pure functions only, no React dependencies
- **i18n**: Keep translation keys namespaced by feature (`step1_*`, `step2_*`)

## Questions?

Check:
1. `.github/copilot-instructions.md` - AI coding patterns
2. `docs/ARCHITECTURE.md` - Technical deep dive
3. `docs/PRODUCT.md` - Feature explanations
4. Code comments in `src/utils/calculations.js` - Acoustic formulas
