import React, { FunctionComponent } from "react"
import { Section, Container } from "rbx"

export const Wrapper: FunctionComponent = ({ children }) => (
  <Section>
    <Container>
      { children }
    </Container>
  </Section>
)
