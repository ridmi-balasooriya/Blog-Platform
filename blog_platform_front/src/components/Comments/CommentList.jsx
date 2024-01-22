import React, {useState, useEffect} from "react"
import axios from "axios"
import API_BASE_URL from "../../config"
import { token, userData } from "../Auth/Token"

const CommentList = ({postId, onCommentAdded}) => {
    const [comments, setComments] = useState([])
    const [editCommentId, setEditCommentId] = useState(null)
    const [editComment, setEditComment] = useState('')

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
                alert('Comment Updated Successfully..!')
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
        <div>
            <h3>Comments:</h3>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        {editCommentId && (editCommentId === comment.id) ? 
                        <div>
                            <input type="text" value={editComment} onChange={(e) => setEditComment(e.target.value)} />  
                            <button onClick={() => handleSaveEditComment(comment.id)}>Save</button>
                            <button onClick={handleCancelEditComment}>Cancel</button>
                        </div>
                        :
                        <div>
                            <span>{comment.content}</span>
                            <span>
                                {   
                                    comment.author_profile.profile_pic ? 
                                    <img src={comment.author_profile.profile_pic} alt={comment.author.username} width='40px' height='40px' />
                                    : <span>{comment.author.username.charAt(0)}</span>                                
                                }
                            </span>
                                
                            <span>{comment.author.username}</span>
                            {userData && (userData.username === comment.author.username) && <button onClick={() => handleEditClick(comment && comment.id, comment && comment.content)}>Edit</button>}
                            {userData && (userData.username === comment.author.username) && <button onClick={() => handleDeleteClick(comment && comment.id)}>Delete</button>}
                        </div>                        
                        }
                        
                    </li>
                ))

                }
            </ul>
        </div>
        
    )
}

export default CommentList