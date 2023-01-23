import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const PostCard = ({ post }) => {
    const date = new Date(post?.createdAt)
    return (
        <article className='masonry__brick entry format-standard'>
            <div className="entry__thumb">
                <a href={`/posts/${post._id}`} className="entry__thumb-link">
                    <img src={post?.image} />
                </a>
            </div>
            <div className="entry__text">
                <div className="entry__header">
                    <div className="entry__date">
                        <p>{date.toDateString()}</p>
                    </div>
                    <h1 className="entry__title"><Link href={`/posts/${post._id}`}>{post?.title}</Link></h1>
                </div>
                <div className="entry__meta">
                    <span className="entry__meta-links">
                        {post?.categories.map((category, i) => <span key={i}>{category}</span>)}
                    </span>
                </div>
                <div className="entry__author" >
                    <img src={post.author.profilePic} alt="" />

                    <h4 className="entry__author-name">
                        <Link href={`/user/${post.author._id}`}>{post.author.username}</Link>
                    </h4>
                </div>
            </div>
        </article>
    )
}

export default PostCard