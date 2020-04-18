import React, { FunctionComponent } from 'react'
import { Card } from '~/types/game'
import Symbols from '~/util/cards/symbols.json'

type DobbleCardProps = {
  card: Card
}

export const DobbleCard: FunctionComponent<DobbleCardProps> = ({ card }) => (
  <>{ card.map(index => <p key={index}>{Symbols[index]}</p>) }</>
)
