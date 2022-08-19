import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from 'rbx'
import { DobbleTitle } from '~/components/atoms/title'
import { Wrapper } from '~/components/atoms/wrapper'

const FourOhFour: NextPage = () => (
  <Wrapper>
    <DobbleTitle text='404 Not Found' />
    <p className='mb-5'>That page could not be found 😞</p>
    <Link href='/'>
      <Button color='light' as='a'>
        Back home
      </Button>
    </Link>
  </Wrapper>
)

export default FourOhFour
