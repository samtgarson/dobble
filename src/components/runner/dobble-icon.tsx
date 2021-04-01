import React, { FunctionComponent, useMemo, useCallback } from "react"
import Symbols from '~/util/cards/symbols.json'
import styles from '~/styles/components/dobble-icon.module.scss'

type DobbleIconProps = {
  symbolIndex: number
  cardIndex: number
  handleChoice?: () => Promise<boolean>
}

const r = (n: number) => `rotate(${n}deg)`

const generateSeed = (min: number, max: number) => (
  Math.random() * (max - min) +min
)

export const DobbleIcon: FunctionComponent<DobbleIconProps> = ({ symbolIndex, cardIndex, handleChoice }) => {
  const { angle, h, angleSeed, sizeSeed } = useMemo(() => {
    // create two rows
    const inner = cardIndex < 3

    // distance from center (inner and outer)
    const h = inner ? 24 : 44

    // pseudo-random looking spread
    const angle = inner
      ? 40 + 120 * cardIndex
      : 20 + 72 * (cardIndex - 3)

    // create two random numbers
    const sizeSeed = inner
      ? generateSeed(0.6, 0.9) // size only varies a little
      : generateSeed(0.8, 1.1) // (and outer ring should be bigger)
    const angleSeed = generateSeed(0.2, 1.8) // angle can vary a lot
    return { angle, h, angleSeed, sizeSeed }
  }, [cardIndex])

  const TagName = useMemo(() => handleChoice ? 'button' : 'span', [handleChoice])
  const onClick = useCallback(async () => {
    if (!handleChoice) return
    await handleChoice()
  }, [handleChoice])

  return (
    <>
      <span
        className={styles.icon}
        key={symbolIndex}
        onClick={onClick}
        style={{
          top: `${50 - h}%`,
          height: `${h}%`,
          transform: r(angle)
        }}
      >
        <TagName className={styles[TagName]} style={{
          transform: `${r(angleSeed * -angle)} scale(${sizeSeed})`
        }}>{Symbols[symbolIndex]}</TagName>
      </span>
    </>
  )
}
