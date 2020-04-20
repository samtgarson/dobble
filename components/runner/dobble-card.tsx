import React, { FunctionComponent, useMemo } from 'react'
import { Card } from '~/types/game'
import { shuffle } from '~/util'
import { DobbleIcon } from './dobble-icon'

type DobbleCardProps = {
  card: Card
  faceup?: boolean
  size?: string
  backText?: string
}

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card, faceup = false, size, backText }) => {
  const shuffledCard = useMemo(() => shuffle(card), [card])
  return (
    <div className={`dobble-card ${faceup ? 'faceup' : ''} ${size ? size : ''}`}>
      <div className="card-front">
        { shuffledCard.map((index, i) => <DobbleIcon key={index} symbolIndex={index} cardIndex={i} />) }
      </div>
      <div className="card-back">
        <span>{ backText || 'Dobble!' }</span>
      </div>
      <style jsx>{`
        .dobble-card {
          width: 400px;
          max-width: 90vw;
          height: 400px;
          max-height: 90vw;
          position: relative;
          transform: rotateY(180deg);
          transform-style: preserve-3d;
          transition: transform .3s ease-in-out;
        }

        .dobble-card.faceup {
          transform: none;
        }

        .card-front,
        .card-back {
          backface-visibility: hidden;
          border-radius: 50%;
          position: absolute;
          border-radius: 50%;
          box-shadow:
            0px 3px 9px 1px rgba(10, 10, 10, 0.1),
            0 0 0 1px rgba(10, 10, 10, 0.1);
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }

        .dobble-card.small .card-front {
          transform: scale(0.8);
        }

        .card-front {
          background: white;
          z-index: 0;
        }

        .dobble-card.hidden .card-front {
          z-index: 1;
        }

        .card-back {
          background-color: #222;
          color: white;
          transform: rotateY(180deg);
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: center;
          font-size: 1.2em;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 500;
        }

        .dobble-card.small .card-back {
          transform: rotateY(180deg) scale(0.8);
        }
      `}</style>
    </div>
  )
}
