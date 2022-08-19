import { NextPage } from 'next'
import Link from 'next/link'
import { Button } from 'rbx'
import { DobbleTitle } from '~/components/atoms/title'
import { Wrapper } from '~/components/atoms/wrapper'

const FiveHundred: NextPage = () => (
  <Wrapper>
    <DobbleTitle text='500 Server Error' />
    <p className='mb-5'>Something went wrong 😳</p>
    <Link href='/'>
      <Button color='light' as='a'>
        Back home
      </Button>
    </Link>
  </Wrapper>
)

export default FiveHundred
