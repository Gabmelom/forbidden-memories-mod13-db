import { useMemo, useState } from 'react'
import {
  calculateDuelRankScore,
  DEFAULT_DUEL_RANK_STATS,
  DUEL_RANK_BASE_SCORE,
  getDuelRank,
  getDuelRankScoreTiers,
  getScoreContributions,
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
  { key: 'lifePoints', label: 'Remaining LP', description: 'Your current life points', step: 100 },
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

export function TecTrackerPage() {
  const [stats, setStats] = useState<DuelRankStats>({ ...DEFAULT_DUEL_RANK_STATS })
  const contributions = useMemo(() => getScoreContributions(stats), [stats])
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
          <span>Modifier</span>
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
              <output className={scoreTone(contributions[field.key])} aria-label={`${field.label} score modifier`}>
                {signedScore(contributions[field.key])}
              </output>
              <div className="tec-tier-list" aria-label={`${field.label} scoring ranges`}>
                {getDuelRankScoreTiers(field.key).map((tier) => {
                  const isActive = stats[field.key] >= tier.min && stats[field.key] <= tier.max
                  return (
                    <span className={isActive ? 'active' : ''} aria-current={isActive ? 'true' : undefined} key={`${tier.min}-${tier.max}`}>
                      <b>{scoreRange(tier.min, tier.max)}</b>
                      <em className={scoreTone(tier.score)}>{signedScore(tier.score)}</em>
                    </span>
                  )
                })}
              </div>
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
