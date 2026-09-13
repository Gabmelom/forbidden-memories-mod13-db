import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import {
  calculateDuelRankScore,
  DEFAULT_DUEL_RANK_STATS,
  DUEL_RANK_BASE_SCORE,
  getDuelRank,
  getDuelRankScoreTiers,
  type DuelRankStat,
  type DuelRankStats,
} from '../utils/duelRank'

interface TrackerField {
  key: DuelRankStat
  label: string
  description: string
  step: number
}

const TRACKER_FIELDS: readonly TrackerField[] = [
  { key: 'turns', label: 'Turns', description: 'Completed duel turns', step: 1 },
  { key: 'cardsUsed', label: 'Cards used', description: 'Cards drawn from your deck', step: 1 },
  { key: 'effectiveAttacks', label: 'Effective attacks', description: 'Attacks that deal damage or destroy a monster', step: 1 },
  { key: 'defensiveWins', label: 'Defensive wins', description: 'Enemy monsters destroyed while you defend', step: 1 },
  { key: 'faceDowns', label: 'Face-down plays', description: 'Cards played face-down', step: 1 },
  { key: 'fusions', label: 'Fusions', description: 'Fusion summons performed', step: 1 },
  { key: 'equipMagic', label: 'Equip magic', description: 'Equip cards activated', step: 1 },
  { key: 'pureMagic', label: 'Spell cards', description: 'Non-equip magic cards activated', step: 1 },
  { key: 'trapsTriggered', label: 'Traps triggered', description: 'Trap cards activated', step: 1 },
  { key: 'lifePoints', label: 'Remaining LP', description: 'Your current life points', step: 50 },
]

function normalizeValue(value: number) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.trunc(value))
}

function signedScore(value: number) {
  return `${value >= 0 ? '+' : ''}${value}`
}

function scoreTone(value: number) {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

function scoreRange(min: number, max: number) {
  if (!Number.isFinite(max)) return `${min}+`
  if (min === max) return String(min)
  return `${min}–${max}`
}

const SCORE_SCALE_MAXIMUMS: Record<DuelRankStat, number> = {
  turns: 38,
  effectiveAttacks: 25,
  defensiveWins: 20,
  faceDowns: 41,
  fusions: 20,
  equipMagic: 20,
  pureMagic: 13,
  trapsTriggered: 9,
  cardsUsed: 42,
  lifePoints: 9000,
}

function formatBoundary(value: number) {
  return value.toLocaleString('en-US')
}

function ScoreScale({
  label,
  stat,
  step,
  value,
  onChange,
}: {
  label: string
  stat: DuelRankStat
  step: number
  value: number
  onChange: (value: number) => void
}) {
  const scaleMaximum = SCORE_SCALE_MAXIMUMS[stat]
  const scaleValue = Math.min(value, scaleMaximum)
  const [sliderValue, setSliderValue] = useState(scaleValue)
  const isSliding = useRef(false)
  const tiers = [...getDuelRankScoreTiers(stat)].sort((left, right) => left.min - right.min)
  const activeTier = tiers.find((tier) => value >= tier.min && value <= tier.max)
  const boundaries = tiers.slice(1).map((tier) => tier.min)
  const activeBoundaries = new Set([
    activeTier?.min,
    Number.isFinite(activeTier?.max) ? Number(activeTier?.max) + 1 : undefined,
  ])

  useEffect(() => {
    if (!isSliding.current) setSliderValue(scaleValue)
  }, [scaleValue])

  const updateFromSlider = (rawValue: number) => {
    setSliderValue(rawValue)
    onChange(Math.round(rawValue / step) * step)
  }

  const finishSliding = (rawValue: number) => {
    isSliding.current = false
    const roundedValue = Math.round(rawValue / step) * step
    setSliderValue(roundedValue)
    onChange(roundedValue)
  }

  return (
    <div className="tec-score-scale" aria-label={`${label} scoring ranges`}>
      <div
        className="tec-score-scale-track"
        style={{
          '--scale-columns': tiers.map((tier, index) => {
            const nextBoundary = tiers[index + 1]?.min ?? scaleMaximum
            return `${Math.max(1, nextBoundary - tier.min)}fr`
          }).join(' '),
        } as CSSProperties}
      >
        {tiers.map((tier) => {
          const isActive = value >= tier.min && value <= tier.max
          return (
            <span
              className={[isActive ? 'active' : '', scoreTone(tier.score)].join(' ')}
              aria-current={isActive ? 'true' : undefined}
              aria-label={`${scoreRange(tier.min, tier.max)} ${label.toLocaleLowerCase()}: ${signedScore(tier.score)} points`}
              key={`${tier.min}-${tier.max}`}
            >
              <em className={scoreTone(tier.score)}>{signedScore(tier.score)}</em>
            </span>
          )
        })}
      </div>
      <input
        className="tec-score-slider"
        type="range"
        min="0"
        max={scaleMaximum}
        step="any"
        value={sliderValue}
        aria-label={`Set ${label.toLocaleLowerCase()}`}
        aria-valuetext={value >= scaleMaximum
          ? `${value} ${label.toLocaleLowerCase()}; maximum scale position`
          : `${value} ${label.toLocaleLowerCase()}`}
        onPointerDown={() => { isSliding.current = true }}
        onPointerUp={(event) => finishSliding(Number(event.currentTarget.value))}
        onPointerCancel={(event) => finishSliding(Number(event.currentTarget.value))}
        onChange={(event) => updateFromSlider(Number(event.currentTarget.value))}
      />
      <div className="tec-score-scale-axis" aria-hidden="true">
        {boundaries.map((boundary, index) => (
          <span
            className={activeBoundaries.has(boundary) ? 'active' : ''}
            style={{ '--tick-position': `${(boundary / scaleMaximum) * 100}%` } as CSSProperties}
            key={boundary}
          >
            {formatBoundary(boundary)}{index === boundaries.length - 1 ? '+' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

function ScoreRangeDisplay({ field, value, onChange }: { field: TrackerField; value: number; onChange: (value: number) => void }) {
  return <ScoreScale label={field.label} stat={field.key} step={field.step} value={value} onChange={onChange} />
}

export function TecTrackerPage() {
  const [stats, setStats] = useState<DuelRankStats>({ ...DEFAULT_DUEL_RANK_STATS })
  const score = useMemo(() => calculateDuelRankScore(stats), [stats])
  const rank = getDuelRank(score)
  const pointsToSTec = Math.max(0, score - 9)

  const setStat = (key: DuelRankStat, value: number) => {
    setStats((current) => ({ ...current, [key]: normalizeValue(value) }))
  }

  const adjustStat = (key: DuelRankStat, amount: number) => {
    setStats((current) => ({ ...current, [key]: normalizeValue(current[key] + amount) }))
  }

  const reset = () => setStats({ ...DEFAULT_DUEL_RANK_STATS })

  return (
    <div className="tec-tracker-page">
      <header className="tec-tracker-heading">
        <div>
          <p className="eyebrow">Manual duel calculator</p>
          <h1>TEC Tracker</h1>
          <p>Update each counter as you play. Your projected duel rank changes immediately.</p>
        </div>
        <button className="tec-reset-button" type="button" onClick={reset}>Reset duel</button>
      </header>

      <section className="tec-result-card" aria-label="Projected duel rank" aria-live="polite">
        <div className={`tec-rank-emblem tec-rank-${rank.toLowerCase().replace(' ', '-')}`}>
          <span>Projected rank</span>
          <strong>{rank}</strong>
        </div>
        <div className="tec-score-summary">
          <span>Rank score</span>
          <strong>{score}</strong>
          <small>Base {DUEL_RANK_BASE_SCORE} + tracked modifiers</small>
        </div>
        <p className={pointsToSTec === 0 ? 'tec-target reached' : 'tec-target'}>
          {pointsToSTec === 0
            ? 'S TEC range reached (9 points or lower).'
            : `${pointsToSTec} ${pointsToSTec === 1 ? 'point' : 'points'} above S TEC range.`}
        </p>
      </section>

      <section className="tec-controls" aria-labelledby="tec-controls-title">
        <div className="tec-section-heading">
          <div>
            <p className="eyebrow">Duel values</p>
            <h2 id="tec-controls-title">Track your actions</h2>
          </div>
        </div>

        <div className="tec-stat-grid">
          {TRACKER_FIELDS.map((field) => (
            <div className="tec-stat-card" key={field.key}>
              <div className="tec-stat-copy">
                <label htmlFor={`tec-${field.key}`}>{field.label}</label>
                <span>{field.description}</span>
              </div>
              <div className="tec-stepper">
                <button
                  type="button"
                  aria-label={`Decrease ${field.label}`}
                  disabled={stats[field.key] === 0}
                  onClick={() => adjustStat(field.key, -field.step)}
                >−</button>
                <input
                  id={`tec-${field.key}`}
                  type="number"
                  min="0"
                  step={field.step}
                  inputMode="numeric"
                  value={stats[field.key]}
                  onChange={(event) => setStat(field.key, Number(event.currentTarget.value))}
                />
                <button
                  type="button"
                  aria-label={`Increase ${field.label}`}
                  onClick={() => adjustStat(field.key, field.step)}
                >+</button>
              </div>
              <ScoreRangeDisplay
                field={field}
                value={stats[field.key]}
                onChange={(value) => setStat(field.key, value)}
              />
            </div>
          ))}
        </div>
      </section>

      <p className="tec-source-note">
        Rank formula adapted from the MIT-licensed{' '}
        <a href="https://github.com/seth-rah/FMR-Auto-Tracker" target="_blank" rel="noreferrer">FMR Auto-Tracker</a>.
      </p>
    </div>
  )
}
