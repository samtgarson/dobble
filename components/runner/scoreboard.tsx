import { Player } from "~/types/game"
import React, { FunctionComponent, useMemo } from "react"

type ScoreboardProps = {
  players: Player[]
  fixed?: boolean
}

const medals = ['🥇', '🥈', '🥉']

export const Scoreboard: FunctionComponent<ScoreboardProps> = ({ players, fixed }) => {
  const scores = useMemo(() => players
   .map(p => ({ name: p.name, score: p.hand.length, id: p.id }))
    .sort((a, b) => a.score - b.score),
  [players])

  return (
    <div className={`scoreboard ${fixed ? 'fixed' : undefined}`}>
      <ul>
        {scores.map((s, i) => (
          <li key={s.id}>
            <span>{ (i < 3) && medals[i] }</span>
            <strong>{ s.name }</strong>
            { s.score }
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          padding: 0;
          margin: 0;
        }

        li {
          list-style-type: none;
        }

        .scoreboard.fixed {
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

        .fixed ul {
          flex: 0 1 auto;
          display: flex;
          justify-content: flex-start;
        }

        .fixed li {
          flex: 0 0 auto;
          margin-left: 20px;
        }

        strong {
          font-weight: bold;
          margin: 0 4px;
        }

        .scoreboard:not(.fixed) span {
          display: inline-block;
          width: 24px;
        }

        .scoreboard:not(.fixed) li {
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  )
}
