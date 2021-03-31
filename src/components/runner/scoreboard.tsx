import React, { FunctionComponent, useMemo } from "react"
import { Players } from "~/types/entities"
import { fi } from "~/util"

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
    <div className={`scoreboard ${fixed ? 'fixed' : undefined}`}>
      <ul>
        {scores.map((s, i) => (
          <li key={s.id} className={fi(s.score < 4, 'warning')}>
            <span>{ (i < 3) && medals[i] }</span>
            <strong>{ s.name }</strong>
            { s.score }
          </li>
        ))}
      </ul>
      <style jsx>{`
        @keyframes shake {
          8%, 41% {
              transform: translateX(-10px);
          }
          25%, 58% {
              transform: translateX(10px);
          }
          75% {
              transform: translateX(-5px);
          }
          92% {
              transform: translateX(5px);
          }
          0%, 100% {
              transform: translateX(0);
          }
        }

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
          padding: 5px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          color: white;
        }

        .fixed ul {
          flex: 0 1 auto;
          display: flex;
          justify-content: flex-start;
          padding-bottom: 3px;
        }

        .fixed li {
          flex: 0 0 auto;
          margin-left: 8px;
          padding: 3px 12px 3px 8px;
          transition: color .2s ease, background-color .2s ease;
        }

        .fixed li.warning {
          border-radius: 20px;
          background: white;
          color: red;
          animation: shake .5s linear;
        }

        strong {
          font-weight: bold;
          margin: 0 4px;
          transition: color .2s ease;
        }

        .fixed strong {
          margin: 0 4px 0 2px;
          color: white;
        }

        .fixed .warning strong {
          color: red;
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
