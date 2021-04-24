import { NextPage } from "next"
import { Button, Title } from 'rbx'
import React from 'react'
import styles from '~/styles/pages/page.module.scss'
import { DobbleTitle } from '../components/atoms/title'
import { Wrapper } from "../components/atoms/wrapper"

const HelpPage: NextPage = () => (
  <Wrapper className={styles.page}>
    <DobbleTitle text='About'>
      <Button color='light' onClick={() => window.history.back()}>Back</Button>
    </DobbleTitle>
    <Title size={6}>How to play</Title>
    <p>The top card is &quot;in the center&quot;, everyone sees this. The bottom card is your &quot;hand&quot;, your aim is to get rid of all your cards.</p>
    <p>To get rid of a card, click the icon which appears on both cards. If you manage to be the first to find the common symbol, your card will go into the center.</p>

    <Title size={6}>Keyboard Shortcuts</Title>
    <table className={styles.keyHolder}>
      <tbody>
        <tr>
          <td><span className={styles.keyIcon} title="Left arrow key">←</span></td>
          <td>Rotate left</td>
        </tr>
        <tr>
          <td><span className={styles.keyIcon} title="Right arrow key">→</span></td>
          <td>Rotate right</td>
        </tr>
        <tr>
          <td><span className={styles.keyIcon} title="Space key">Space</span></td>
          <td>Reset rotation</td>
        </tr>
      </tbody>
    </table>
  </Wrapper>
)

export default HelpPage
