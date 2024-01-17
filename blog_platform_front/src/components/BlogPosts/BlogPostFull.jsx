import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import { useParams, useNavigate } from "react-router-dom";
import {token, userData} from "../Auth/Token";
import CommentForm from "../Comments/CommentForm";
import CommentList from "../Comments/CommentList";
import Like from "../Likes/Like";

const BlogPostFull = () =>{
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        //Get the Post
        axios.get(`${API_BASE_URL}/api/postlist/${id}/`)
        .then((response) => {
            setPost(response.data);
        })
        .catch((error) => {
            alert(`Error fetching blog post:
            ${error}`);
        })

        //Get Comments related to the post id. ***(Callback when adding new comment)
        axios.get(`${API_BASE_URL}/api/comments/?postId=${id}`,  
            {headers: {'Content-Type': 'application/json'}}
        )
        .then(response => {
            setComments(response.data)
        })
        .catch(error => {
            console.log(`Error fetching comments: ${error}`)
        })

    }, [id]);

    const handleCommentAdded = (newComment) => {
        setComments([...comments, newComment])
    }
    
    const handleEditClick = (postId) => {
        navigate(`/dashboard/?postId=${postId}`)
    }

    const handleDeleteClick = (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?')

        if(confirmDelete){
            axios.delete(
                `${API_BASE_URL}/api/posts/${postId}`,
                { headers : { Authorization: `Token ${token}`}}
            ).then(response => {
                alert(`Your blog post is deleted successfully..!`)
                navigate(`/`)
                console.log(`Post ${postId} deleted successfully`);
            }).catch(error => {
                console.log(`Error deleting post ${postId}: ${error}`)
            })
        }
    }

    const handleIsPublic = (postId, isPublic) => {
        axios.put(`${API_BASE_URL}/api/posts/${postId}/`, {is_public: !isPublic},
            { headers : { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}}
        ).then(response => {
            setPost(response.data);
        }).catch(error => {
            console.log(`Error changing post status ${postId}: ${error}`)
        })
    }
    
    return(        
        <div className="article-div">
            <h1>{post && post.title}</h1>
            {post && <Like postId={post.id} /> }
            <p><em>{post && post.author.username}</em></p>
            <div>
                <strong>Tags: </strong>
                {post && post.tags.map((tag, index) => 
                <span key={tag.name}> {tag.name} {index < post.tags.length - 1 && '|'} </span> )}
            </div>
            <div>
                <strong>Category: </strong>
                <span>{post && post.category.name}</span>
            </div>
            {post && token && (userData.username === post.author.username) && <button onClick={() => handleEditClick(post && post.id)}>Edit Post</button> }
            {post && token && (userData.username === post.author.username) && <button onClick={() => handleDeleteClick(post && post.id)}>Delete</button> }
            {
                post && token && (userData.username === post.author.username) && 
                <button onClick={() => handleIsPublic(post && post.id, post && post.is_public)}>
                    {post && post.is_public ? <span>Make Draft</span> : <span>Make Public</span>}
                </button> 
            }
            {post && post.image && 
                <div className="post_image">
                    {post && <img src={`${post.image}`} alt={post.title} /> }
                </div>
            }            
            <div className="article-content">
                {post &&  <p dangerouslySetInnerHTML={{ __html: post.content }} />}
            </div>
            <a href='/'>Back To Article List</a>
            {post && token && <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} /> }
            {post && <CommentList postId={post.id} onCommentAdded={handleCommentAdded} /> }
        </div>
    )


}

export default BlogPostFull;