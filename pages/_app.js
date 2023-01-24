import '../styles/base.css'
import '../styles/globals.css'

import {Toaster} from 'react-hot-toast'
import { UserContext } from '../context/userContext'
import Layout from '../components/Layout'
import {QueryClientProvider, QueryClient}from 'react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
const queryClient = new QueryClient()
export default function App({ Component, pageProps }) {
  const router = useRouter();
  return(<UserContext>
    <QueryClientProvider client={queryClient}>
    <Layout>
      <Toaster containerClassName='toster'
      position='bottom-center'/>
    <AnimatePresence exitBeforeEnter>
      <motion.div
      key={router.route}
      initial='initialState'
      animate='animateState'
      exit='exitState'
      transition={{
        duration: 0.2,
      }}
      variants={{
        initialState: {
          opacity: 0,
          width:0
          //clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        },
        animateState: {
          opacity: 1,
          width:'100%'
          //clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        },
        exitState: {
          x: '100%'
          //clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
        },
      }} >
      <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
    </Layout>
    </QueryClientProvider>
   </UserContext>) 
}
