import React, { useState } from "react"
import axios from "axios"
import API_BASE_URL from '../../config';
import { token, userData } from '../Auth/Token';

const CommentForm = ({postId, onCommentAdded}) => {
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        post : postId,
        author: userData.id,
        content: '',
    })
    
    const clearMessages = () => {
        setSuccess('')
        setError('')
    }

    const timeOutSuccess = (time = 5000) => {
        setTimeout(() => {
            setSuccess('');
        }, time);
    }

    const timeOutError = (time = 5000) => {
        setTimeout(() => {
            setError('');
        }, time);
    }

    const checkForNull = (commentContent) => {
        if (commentContent === null || commentContent.trim() === ''){
            clearMessages();
            setError('Comment cannot be empty..!')
            timeOutError()
            return true
        }
        return false
    }

    const handleCommentChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmission = (e) =>{
        e.preventDefault();
        console.log(formData)
        const isNull = checkForNull(formData.content)
        const postData = new FormData()
        postData.append('author', formData.author)
        postData.append('content', formData.content)
        postData.append('post', formData.post)
        
        if(!isNull){
            axios.post(`${API_BASE_URL}/api/comments/`, postData, 
                {headers: {Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}}
            )
            .then(response => {
                clearMessages();
                setSuccess('Your Comment Submited Successfully...');
                timeOutSuccess()
                onCommentAdded(response.data)
                setFormData({
                    post : postId,
                    author: userData.id,
                    content: '',
                })
            })
            .catch(error => {
                clearMessages();
                setError(`Error updating blog post: ${error}`)
                timeOutError()
            })
        }
    }

    return(
        <div>
            {error && <div>{error}</div>}
            {success && <div>{success}</div>}
            <h4>Add New Comment</h4>
            <form onSubmit={handleSubmission}>
                <textarea name="content" value={formData.content} onChange={handleCommentChange}></textarea>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default CommentForm