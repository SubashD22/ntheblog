import axios from 'axios'
import { set } from 'mongoose'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useUserContext } from '../context/userContext'
const fetchComments = (postId) => {
    return axios.get(`/api/comments/${postId}`)
}
const Comments = ({ postId }) => {
    const { user } = useUserContext();
    const { data: comments, refetch } = useQuery(['comment', postId], () => fetchComments(postId), {
        enabled: !!postId,
    })
    const commentTread = comments?.data
    const [comment, setComment] = useState('');
    const [edditing, setEditing] = useState(false);
    const [commentId, setCommentid] = useState('');
    const submitComment = async (e) => {
        e.preventDefault();
        const data = { postId, comment };
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }
        try {
            const response = await axios.post('/api/comments/addcomment', data, config);
            if (response) {
                refetch();
                setComment('')
                toast.success(response.data)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    const updateComment = async (e) => {
        e.preventDefault();
        const data = { commentId, comment };
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        }
        try {
            const response = await axios.put('/api/comments/updatecomment', data, config);
            if (response) {
                refetch();
                setComment('');
                setCommentid('');
                setEditing(false)
                toast.success(response.data)
            }
        } catch (error) {
            toast.error(error.message)
        }

    };
    const deleteComment = async (e, id) => {
        e.preventDefault();
        const data = { commentId: id };
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            }
        };
        try {
            const response = await axios.put('/api/comments/deletecomment', data, config);
            if (response) {
                refetch();
                toast.success(response.data)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const editComment = (c, id) => {
        console.log(id)
        setEditing(true);
        setComment(c);
        setCommentid(id)
    }
    return (
        <div className="comments-wrap">
            <div id="comments" className='row'>
                <div className="col-full">
                    <h3 className="h2">{`${commentTread?.length} Comments`}</h3>
                    <ol className='commentlist'>
                        {commentTread?.map(c => {
                            const date = new Date(c.createdAt)
                            return (
                                <li key={c._id} className='depth-1 comment'>
                                    <div className="comment__avatar">
                                        <img width="50" height="50" className="avatar" src={c.author.profilePic} alt="" />
                                    </div>
                                    <div className="comment__content">

                                        <div className="comment__info">
                                            <cite>{c.author.username}</cite>

                                            <div className="comment__meta">
                                                <time className="comment__time"> {date.toDateString()}</time>

                                            </div>
                                        </div>

                                        <div className="comment__text">
                                            <p>{c.comment}</p>
                                            {user?._id === c.author?._id ? <div><a href='#cMessage' className='drkbtn'
                                                onClick={() => editComment(c.comment, c._id)}>Edit</a> <span className='drkbtn' onClick={(e) => deleteComment(e, c._id)}>Delete</span></div> : <></>}
                                        </div>

                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                    <div className="respond">
                        <h3 className="h2">{edditing ? 'Edit Comment' : 'Add Comment'}</h3>
                        <form name="contactForm" id="contactForm" onSubmit={submitComment}>
                            <fieldset>
                                <div className="message form-field">
                                    <textarea name="cMessage" id="cMessage" className="full-width" placeholder="Your Comment" value={comment}
                                        onChange={(e) => { setComment(e.target.value) }} required></textarea>
                                </div>
                                {edditing ? <button onClick={updateComment} className="submit btn--primary btn--large full-width" >Update</button> :
                                    <button type="submit" className="submit btn--primary btn--large full-width" >Submit</button>}

                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comments