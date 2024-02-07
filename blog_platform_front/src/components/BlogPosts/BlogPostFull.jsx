import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from 'react-helmet'
import {token, userData} from "../Auth/Token";
import CommentForm from "../Comments/CommentForm";
import CommentList from "../Comments/CommentList";
import Like from "../Likes/Like";
import Layout from "../../templates/Layout";

const BlogPostFull = () =>{
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([])
    

    useEffect(() => {
        //Get the Post
        axios.get(`${API_BASE_URL}/api/postlist/${id}/`)
        .then((response) => {
            setPost(response.data);
        })
        .catch((error) => {
            error.response.status === 404 ? navigate('/404')
            : console.log(`Error Loading the Post: ${error}`);
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

    }, [id, navigate]);

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
        axios.put(`${API_BASE_URL}/api/posts/${postId}/`, {is_public: !isPublic, slug: post.slug},
            { headers : { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}}
        ).then(response => {
            setPost(response.data);
        }).catch(error => {
            console.log(`Error changing post status ${postId}: ${error}`)
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        const monthIndex = date.getMonth()
        const monthName = monthNames[monthIndex]
        return `${monthName} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    }

    
    return( 
        <Layout>  
            <Helmet>
                <meta name="description" content={post && post.meta_description} />
            </Helmet>  
            <article className="article container">
                {post && post.image && 
                    <div className="post_image">
                        {post && <img src={`${post.image}`} alt={post.title} /> }
                    </div>
                }                 
                <div className="text-center pt-5">
                    <span className="fs-4">{post && post.category.name}</span>
                </div>
                <h1 className="text-center">{post && post.title}  <br/> <i className="bi bi-dash-lg"></i></h1>
                <div className="text-center mb-2">
                    {post && post.tags.map((tag, index) => 
                    <span className="badge tag-badge mx-1 mb-1 p-2 d-inline-block" key={tag.name}> {tag.name} </span> )}
                </div>  
                <div className="author-div text-center text-md-end mb-4 color-subfont">                    
                    <span className="d-inline-block px-2">
                        <strong>
                        <Link to={`/author/${post && post.author.id}`}>
                            {post && post.author_profile.author.first_name} {post && post.author_profile.author.last_name}
                        </Link> - {post && formatDate(post.updated_at)}
                        </strong>
                    </span>
                    <strong>| {post && <Like postId={post.id} />}</strong>
                </div>
                
                {post && token && (userData.username === post.author.username) && <button onClick={() => handleEditClick(post && post.id)}>Edit Post</button> }
                {post && token && (userData.username === post.author.username) && <button onClick={() => handleDeleteClick(post && post.id)}>Delete</button> }
                {
                    post && token && (userData.username === post.author.username) && 
                    <button onClick={() => handleIsPublic(post && post.id, post && post.is_public)}>
                        {post && post.is_public ? <span>Make Draft</span> : <span>Make Public</span>}
                    </button> 
                }
                          
                <div className="article-content">
                    {post &&  <p dangerouslySetInnerHTML={{ __html: post.content }} />}
                </div>
                <a href='/' className="d-block mb-5">Back To Article List</a>
                {post && token && <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} /> }
                {post && <CommentList postId={post.id} onCommentAdded={handleCommentAdded} /> }
            </article>
        </Layout>   
    )


}

export default BlogPostFull;