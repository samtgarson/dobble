import React, { FunctionComponent, useMemo } from "react"
import Symbols from '~/util/cards/symbols.json'

type DobbleIconProps = {
  symbolIndex: number
  cardIndex: number
}

const r = (n: number) => `rotate(${n}deg)`

const generateSeed = (min: number, max: number) => (
  Math.random() * (max - min) +min
)

const border = (color: string) => `
  -2px -2px 0px ${color},
  -2px 0px 0px ${color},
  -2px 2px 0px ${color},
  0px -2px 0px ${color},
  0px 2px 0px ${color},
  2px -2px 0px ${color},
  2px 0px 0px ${color},
  2px 2px 0px ${color}
`

export const DobbleIcon: FunctionComponent<DobbleIconProps> = ({ symbolIndex, cardIndex }) => {
  const { angle, h, angleSeed, sizeSeed } = useMemo(() => {
    // create two rows
    const inner = cardIndex < 3

    // distance from center (inner and outer)
    const h = inner ? 22 : 42

    // pseudo-random looking spread
    const angle = inner
      ? 40 + 120 * cardIndex
      : 20 + 72 * (cardIndex - 3)

    // create two random numbers
    const sizeSeed = generateSeed(0.7, 1.1) // size only varies a little
    const angleSeed = generateSeed(0.2, 1.8) // angle can vary a lot
    return { angle, h, angleSeed, sizeSeed }
  }, [cardIndex])

  return (
    <>
      <span
        className="dobble-icon"
        key={symbolIndex}
        style={{
          top: `${50 - h}%`,
          height: `${h}%`,
          transform: r(angle)
        }}
      >
        <span style={{
          transform: `${r(angleSeed * -angle)} scale(${sizeSeed})`
        }}>{Symbols[symbolIndex]}</span>
      </span>

      <style jsx>{`
        .dobble-icon {
          font-size: 16vw;
          position: absolute;
          display: block;
          transform-origin: bottom center;
          left: 50%;
          margin-left: -6%;
          line-height: 1em;
          pointer-events: none;
        }

        @media (min-width: 444px) {
          .dobble-icon {
            font-size: 72px;
          }
        }

        .dobble-icon span {
          display: block;
          pointer-events: auto;
        }
      `}</style>
    </>
  )
}
