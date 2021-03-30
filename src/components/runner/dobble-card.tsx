import React, { FunctionComponent, useMemo } from 'react'
import { Card } from '~/types/game'
import { fi } from '~/util'
import { DobbleIcon } from './dobble-icon'
import { motion, Variants } from 'framer-motion'

type DobbleCardProps = {
  card: Card
  handleChoice?: (index: number) => Promise<boolean>
  faceup?: boolean
  size?: string
  backText?: string
}

const variants: Variants = {
  initial: {
    rotateY: '180deg',
    opacity: 0
  },
  animate: {
    opacity: 1,
    rotateY: '0deg'
  },
  exit: {
    rotateY: '180deg',
    opacity: 0
  }
}

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card, faceup = false, size, backText, handleChoice }) => {
  const prefix = useMemo(() => card.join('-'), [card])

  return (
    <motion.div
      key={prefix}
      variants={backText ? {} : variants}
      initial='initial'
      animate='animate'
      exit='exit'
      className={`card-wrapper ${size ? size : ''}`}
    >
      <div
        className={`dobble-card ${faceup ? 'faceup' : ''}`}
      >
        <div className="card-front">
          { card.map((index, i) => (
            <DobbleIcon
              key={`${prefix}-${index}`}
              symbolIndex={index}
              cardIndex={i}
              handleChoice={fi(handleChoice, () => handleChoice!(index))}
            />
          )) }
        </div>
        <div className="card-back">
          <span>{ backText || 'Dobble!' }</span>
        </div>

        <style jsx global>{`
          .card-wrapper {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 45%;
          }

          .card-wrapper.small {
            top: 40px;
          }

          .dobble-card {
            width: 400px;
            max-width: min(90vw, 45vh);
            height: 400px;
            max-height: min(90vw, 45vh);
            margin: 0 auto;
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

          .small .card-front {
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
            background-color: #FF008C;
            color: white;
            transform: rotateY(180deg);
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            align-items: center;
            font-size: 1.2em;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: bold;
          }

          .small .card-back {
            transform: rotateY(180deg) scale(0.8);
          }
        `}</style>
      </div>
    </motion.div>
  )
}
