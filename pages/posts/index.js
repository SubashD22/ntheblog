import axios from 'axios';
import React, { useState } from 'react'
import PostCard from '../../components/PostCard';
import { motion } from 'framer-motion'

const AllPosts = ({posts}) => {
    const [filter, setFilter] = useState('allpost')

    const selectedCategory = (e) => {
        setFilter(e.target.value)
    };
    const filteredPost = posts?.filter(f => f.categories.includes(filter))
    let postSection = filter === 'allpost' ? (posts?.map(p => {
        return (<PostCard post={p} key={p.id} />
        )
    })) : (filteredPost.map(p => {
        return (<PostCard post={p} key={p.id} />
        )
    }))
  return (
    <div className='s-content'>
      <div style={{display:'flex',
     justifyContent:'center',
     margin:'5rem'}}>
      <select name="Category" id="Category" className='select-box' onChange={selectedCategory}>
          <option value="allpost" selected multiple>All Post</option>
          <option value="fashion">fashion</option>
          <option value="food">food</option>
          <option value="games">games</option>
          <option value="hobby">hobby</option>
          <option value="movies">movies</option>
          <option value="music">music</option>
          <option value="sports">sports</option>
          <option value="story">story</option>
          <option value="travel">travel</option>
      </select>
      </div>
      <section>
        <div className='row masonry-wap'>
          <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                delay: 0.5,
                duration: 0.2,
            }} className='archive'>
            {postSection}
          </motion.div>
         </div>
      </section>
   </div>
  )
}

export default AllPosts
export const getServerSideProps = async()=>{
    let hostname;
  if(process.env.NODE_ENV === 'development'){
    hostname = process.env.NEXT_PUBLIC_DEV_URL
  }else{
    hostname = process.env.NEXT_PUBLIC_PROD_URL
  };
    const posts = await axios.get(`http://${hostname}/api/posts/allposts`);
    return({
      props:{
        posts:posts.data
      }
    })
  }