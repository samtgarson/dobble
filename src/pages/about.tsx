import { NextPage } from 'next'
import { Button, Title } from 'rbx'
import * as React from 'react'
import { DobbleTitle } from '~/components/atoms/title'
import { Wrapper } from '~/components/atoms/wrapper'
import styles from '~/styles/pages/page.module.scss'

const About: NextPage = () => (
  <Wrapper className={styles.page}>
    <DobbleTitle text='About'>
      <Button color='light' onClick={() => window.history.back()}>Back</Button>
    </DobbleTitle>
    <p>
    This is an attempt to build a digital version of the kids&apos; card game <a href="https://www.asmodee.co.uk/featured-product/dobble/">Dobble</a>. It&apos;s <a href="https://github.com/samtgarson/dobble">open source</a> and definitely not affiliated with the official Dobble game, or Asmodee, the company that made it.
    </p>

    <Title size={6}>How to play</Title>
    <p>
    Once you&apos;ve created a game (you can share it with others to play multiplayer if you want), hit Begin Game to begin.
    </p>
    <p>
    The object of the game is be the first one to get rid of all your cards (you can see how many cards you have left at the bottom of the screen). To get rid of a card, tap the icon from your hand (the bottom card on screen) that is also on the card from the deck (the top card on screen). Each card only has one matching icon with every other card.
    </p>
    <p>Good luck!</p>

    <Title size={6}>Backstory</Title>
    <p>
    A colleague brought in the real game of Dobble to our digital product team to introduce an element of fun and build our team. It worked really well, and we found ourselves playing Dobble whenever we needed a quick break.
    </p>
    <p>
    With the advent of COVID-19 we could no longer play Dobble while working from home, so I attempted to build a version we could play while in quarantine.
    </p>
    <p>Build with 💜 by <a href="https://samgarson.com">Sam Garson</a>.</p>
  </Wrapper>
)

export default About
