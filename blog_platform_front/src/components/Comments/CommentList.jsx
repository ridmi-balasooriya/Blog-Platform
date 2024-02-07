import React, {useState, useEffect} from "react"
import axios from "axios"
import API_BASE_URL from "../../config"
import { token, userData } from "../Auth/Token"

const CommentList = ({postId, onCommentAdded}) => {
    const [comments, setComments] = useState([])
    const [editCommentId, setEditCommentId] = useState(null)
    const [editComment, setEditComment] = useState('')
    const [success, setSuccess] = useState('')

    const clearMessages = () => {
        setSuccess('')
    }

    const timeOutSuccess = (time = 5000) => {
        setTimeout(() => {
            setSuccess('');
        }, time);
    }

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/comments/?postId=${postId}`,  
            {headers: {'Content-Type': 'application/json'}}
        )
        .then(response => {
            setComments(response.data)
        })
        .catch(error => {
            console.log(`Error fetching comments: ${error}`)
        })
    }, [postId, onCommentAdded])

    

    const checkForNull = (commentContent) => {
        if (commentContent === null || commentContent.trim() === ''){
            return true
        }
        return false
    }

    const handleEditClick = (commentId, commentContent) => {
        setEditCommentId(commentId)
        setEditComment(commentContent)
    }
    const handleSaveEditComment = (commentId) => {
        const isEmpty = checkForNull(editComment)

        if(!isEmpty){
            axios.put(`${API_BASE_URL}/api/comments/${commentId}/`, 
            { content: editComment },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(response => {
                const updateCommentList = (comments.map(comment => {
                    if(comment.id === commentId){
                        return{...comment, content: editComment}
                    }
                    return comment
                }))
                setComments(updateCommentList)
                setEditCommentId(null)
                setEditComment('')
                setSuccess('Comment Updated Successfully..!');
                timeOutSuccess()
            })
            .catch(error => {
                alert(`Error updating comment: ${error}`)
            })
        }else{
            alert(`Updated Comment Cannot be Empty..!`)
        }
    }

    const handleCancelEditComment = () => {
        setEditCommentId(null)
        setEditComment(null)
    }

    const handleDeleteClick = (commentId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete your comment?`)
        if(confirmDelete){
            axios.delete(`${API_BASE_URL}/api/comments/${commentId}/`,
            { 
                headers : { Authorization: `Token ${token}`}
            })
            .then(response => {
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId))
                alert('You Comment Delete Successfully..!')
            })
            .catch(error => {
                alert(`Error deleting comment: ${error}`)
                console.log(`Error deleting comment: ${error}`)
            })
        }
    }

    return(
        <>
        {(comments.length > 0) &&
            <div className="comment-section">
                <h3>Comments:</h3>
                <ul>
                    {success && <div className="alert alert-success">{success}</div>}
                    {comments.map((comment) => (
                        <li key={comment.id}>                        
                            {editCommentId && (editCommentId === comment.id) ? 
                             <div className="d-flex flex-row flex-wrap align-items-center">
                                <span className="d-inline-block me-2">
                                    {   
                                        comment.author_profile.profile_pic
                                        ? <img src={comment.author_profile.profile_pic} alt={comment.author.username} width='40px' height='40px' />
                                        : <span className="author-profile-initial">{comment.author.username.charAt(0).toUpperCase()}</span>                                
                                    }
                                </span>
                                <span>
                                    <textarea className="comment-block update-comment" type="text" value={editComment} onChange={(e) => setEditComment(e.target.value)}></textarea>
                                </span>
                                <span className="d-block text-end mt-2 mt-md-0">
                                    <button className="btn btn-dark btn-thin ms-2" onClick={() => handleSaveEditComment(comment.id)}>Save</button>
                                    <button className="btn btn-dark btn-thin ms-2" onClick={handleCancelEditComment}>Cancel</button>
                                </span>
                            </div>
                            :
                            <div className="d-flex flex-row flex-wrap align-items-center">
                                <span className="d-inline-block me-2">
                                    {   
                                        comment.author_profile.profile_pic
                                        ? <img src={comment.author_profile.profile_pic} alt={comment.author.username} width='40px' height='40px' />
                                        : <span className="author-profile-initial">{comment.author.username.charAt(0).toUpperCase()}</span>                                
                                    }
                                </span>
                                <span className="comment-block">
                                    {comment.content}
                                    <span className="comment-username d-block text-end mt-1 mt-md-2"><em>~ {comment.author.username}</em></span>
                                </span>
                                <span className="btn-span text-end mt-3">
                                    {userData && (userData.username === comment.author.username) && <button className="btn btn-dark btn-thin ms-2" onClick={() => handleEditClick(comment && comment.id, comment && comment.content)}>Edit</button>}
                                    {userData && (userData.username === comment.author.username) && <button className="btn btn-dark btn-thin ms-2" onClick={() => handleDeleteClick(comment && comment.id)}>Delete</button>}
                                </span>                                
                            </div>                        
                            }
                            
                        </li>
                    ))

                    }
                </ul>
            </div>
            }
        </>
    )
}

export default CommentList