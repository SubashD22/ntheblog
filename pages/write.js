import dynamic from 'next/dynamic'

const Write = dynamic(() => import('../components/write'), {
  ssr: false
})

export default () => <Write/>