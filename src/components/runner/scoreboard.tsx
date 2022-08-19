import cn from 'classnames/bind'
import { FunctionComponent, useMemo } from 'react'
import { medals } from '~/src/util'
import styles from '~/styles/components/scoreboard.module.scss'
import { Players } from '~/types/entities'

const cx = cn.bind(styles)

type ScoreboardProps = {
  players: Players
  banner?: boolean
}

export const Scoreboard: FunctionComponent<ScoreboardProps> = ({ players }) => {
  const scores = useMemo(
    () =>
      Object.values(players)
        .map((p) => ({ name: p.name, score: p.hand.length, id: p.id }))
        .sort((a, b) => a.score - b.score),
    [players]
  )

  return (
    <div className={cx('scoreboard')}>
      <ul>
        {scores.map((s, i) => (
          <li key={s.id} className={cx({ warning: s.score < 4 })}>
            <span className={cx('medal')}>{i < 3 && medals[i]}</span>
            <span className={cx('name')}>{s.name}</span>
            {s.score}
          </li>
        ))}
      </ul>
    </div>
  )
}
