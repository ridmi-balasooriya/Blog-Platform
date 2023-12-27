import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import { useParams, useNavigate } from "react-router-dom";
import {token, userData} from "../Auth/Token";

const BlogPostFull = () =>{
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/postlist/${id}/`)
        .then((response) => {
            setPost(response.data);
        })
        .catch((error) => {
            alert(`Error fetching blog post:
            ${error}`);
        })
    }, [id]);
    
    const handleEditClick = (postId) =>{
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
    
    return(
        
        <div className="article-div">
            <h1>{post && post.title}</h1>
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
            {post && (userData.username === post.author.username) && <button onClick={() => handleEditClick(post && post.id)}>Edit Post</button> }
            {post && (userData.username === post.author.username) && <button onClick={() => handleDeleteClick(post && post.id)}>Delete</button> }
            {post && post.image && 
                <div className="post_image">
                    {post && <img src={`${post.image}`} alt={post.title} /> }
                </div>
            }            
            <div className="article-content">
                {post &&  <p dangerouslySetInnerHTML={{ __html: post.content }} />}
            </div>
            <a href='/'>Back To Article List</a>
        </div>
    )


}

export default BlogPostFull;