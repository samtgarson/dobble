import { Player } from "~/types/game"
import React, { FunctionComponent, useMemo } from "react"

type ScoreboardProps = {
  players: Player[]
}

const medals = ['🥇', '🥈', '🥉']

export const Scoreboard: FunctionComponent<ScoreboardProps> = ({ players }) => {
  const scores = useMemo(() => players
    .map(p => ({ name: p.name, score: p.hand.length }))
    .sort((a, b) => a.score - b.score),
  [players])

  return (
    <div className="scoreboard">
      <ul>
        {scores.map((s, i) => (
          <li key={s.name}>
            { (i < 3) && medals[i] }
            <span>{ s.name }</span>
            { s.score }
          </li>
        ))}
      </ul>
      <style jsx>{`
        .scoreboard {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          color: white;
        }

        ul {
          flex: 0 1 auto;
          display: flex;
          justify-content: flex-start;
        }

        li {
          flex: 0 0 auto;
          margin-left: 20px;
        }

        span {
          font-weight: bold;
          margin: 0 4px;
        }
      `}</style>
    </div>
  )
}
