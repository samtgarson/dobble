import React, { FunctionComponent, useMemo } from "react"
import { Players } from "~/types/entities"
import cn from 'classnames/bind'
import styles from '~/styles/components/scoreboard.module.scss'

const cx = cn.bind(styles)

type ScoreboardProps = {
  players: Players
  fixed?: boolean
}

const medals = ['🥇', '🥈', '🥉']

export const Scoreboard: FunctionComponent<ScoreboardProps> = ({ players, fixed }) => {
  const scores = useMemo(() => Object.values(players)
    .map(p => ({ name: p.name, score: p.hand.length, id: p.id }))
    .sort((a, b) => a.score - b.score),
  [players])

  return (
    <div className={cx('scoreboard', { fixed })}>
      <ul>
        {scores.map((s, i) => (
          <li key={s.id} className={cx({ warning: s.score < 4 })}>
            <span className={cx('medal')}>{ (i < 3) && medals[i] }</span>
            <span className={cx('name')}>{ s.name }</span>
            { s.score }
          </li>
        ))}
      </ul>
    </div>
  )
}
