import axios from 'axios';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../context/userContext';
import { motion } from 'framer-motion'

const Comments = dynamic(() => import('../../components/Comments'), {
    ssr: false
  })

const fullpost = ({post}) => {
    console.log(typeof(post?.image))
    const {user,deletepost} = useUserContext();
    const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return null;
  }
  const date= new Date(post?.createdAt)
 
  return (
    <div>
        <Head>
            <title>{post?.title}</title>
        </Head>
        <motion.div 
         
        className="s-content s-content--narrow s-content--no-padding-bottom">
            <article className="row format-standard">
                <div className="s-content__header col-full">
                    {user?._id === post.author._id ? 
                    <div>
                        <Link className='drkbtn' href={`/edit/${post.slug}`}>Edit</Link>
                        <button className='drkbtn' onClick={()=>deletepost(post._id)}>Delete</button>
                    </div>:
                    <></>}
                    <h1 className="s-content__header-title">
                        {post?.title}
                    </h1>
                    <ul className="s-content__header-meta">
                        <li className="date">{date?.toDateString()}</li>
                    </ul>
                </div>
                {post?.image && post?.image !== '' || undefined ?
               
                <div className="s-content__media col-full">
                 <div className="s-content__post-thumb">
                    <img src={post?.image} />
                 </div>
                </div> :<></>
             }
                
                <div className="col-full s-content__main" dangerouslySetInnerHTML={{ __html: post?.text }}/>
                <div className="s-content__tags scmp">
                    <span>Categories</span>
                    <span className="s-content__tag-list">
                        {post?.categories.map((c,i) => <a key={i}>{c}</a>)}
                    </span>
                </div>
                <div className="s-content__author scmp" >
                    <img src={post.author.profilePic} alt=""/>

                    <div className="s-content__author-about">
                        <h4 className="s-content__author-name">
                            <Link href={`/user/${post.author._id}`}>{post.author.username}</Link>
                        </h4>
                    </div>
                </div>
            </article>
           <Comments postId={post._id}/> 
        </motion.div>
    </div>
  )
}

export default fullpost;
export const getServerSideProps = async(ctx)=>{
    const {id} = ctx.params
    let hostname;
    if(process.env.NODE_ENV === 'development'){
      hostname = process.env.NEXT_PUBLIC_DEV_URL
    }else{
      hostname = process.env.NEXT_PUBLIC_PROD_URL
    };
    const {data} = await axios.get(`http://${hostname}/api/posts/${id}`);
    return{
        props:{
            post:data
        }
    } 
}