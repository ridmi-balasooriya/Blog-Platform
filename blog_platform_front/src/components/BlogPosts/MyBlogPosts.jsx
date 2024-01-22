import { useState, useEffect } from "react"
import axios from "axios"
import API_BASE_URL from "../../config"
import { token } from "../Auth/Token"
import DOMPurify from 'dompurify';

const MyBlogPost = () => {
    const [blogPosts, setBlogPost] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [nextPage, setNextPage] = useState([]);
    const [totalPages, setTotalPage] = useState(1)
    const [successMsg, setSuccessMsg] = useState('');

    const timeOutSuccess = (time = 5000) => {
        setTimeout(() => {
            setSuccessMsg('');
        }, time);
    }
    
    useEffect(() => {
        if(token){
            axios.get(`${API_BASE_URL}/api/my_posts?search=${searchInput}&type=${searchType}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(response => {
                setBlogPost(response.data.results)
                setNextPage(response.data.next);
                setTotalPage(Math.ceil(response.data.count/response.data.results.length))
            })
            .catch(error => {
                console.log(`Error fetching user-specific blog posts: ${error}`)
                alert(`Error fetching user-specific blog posts: ${error}`)
            })
        }
    },[searchInput, searchType]);

    const loadMorePosts = (pageNum) => {
        if (nextPage) {
            axios.get(`${API_BASE_URL}/api/my_posts?page=${pageNum}&search=${searchInput}&type=${searchType}`, {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(response => {
                setBlogPost(response.data.results);
            })
            .catch(error => {
                alert(`Error fetching more blog posts: ${error}`);
            });
        }
    };

    const getPostReadMore = (content) => {
        const words = content.split(' ');
        if (words.length > 50){
            return words.slice(0, 50).join(' ') + '...';
        }else{
            return words.join(' ');
        }
    }

    const handleUpdateClick = (postId) => {
        //Send for dashboad form create/update panel to do the update.
        window.location.href = `/dashboard?postId=${postId}`;
    };

    const handleDeleteClick = (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?')

        if(confirmDelete){
            axios.delete(
                `${API_BASE_URL}/api/posts/${postId}`,
                { headers : { Authorization: `Token ${token}`}}
            ).then(response => {
                setSuccessMsg('Your blog post is deleted successfully..!')
                setBlogPost(
                    prevPosts => prevPosts.filter(post => post.id !== postId )
                )
                console.log(`Post ${postId} deleted successfully`);
                timeOutSuccess()
            }).catch(error => {
                console.log(`Error deleting post ${postId}: ${error}`)
            })
        }
    }

    return(
        <div>
            <div>
                <select name="search_type" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value='title'>Title</option>
                    <option value='category'>Category</option>
                </select>
                <input type="text" name="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            <h1>My Blog Posts</h1>
            {successMsg && <div>{successMsg}</div>}
            <ul>
                {blogPosts.map(post => (
                    <li key={post.id}>
                        <button onClick={() => handleUpdateClick(post.id)}>Edit</button>
                        <button onClick={() => handleDeleteClick(post.id)}>Delete</button>
                        <h2><a href={`/posts/${post.id}`} target="_blank" rel="noopener noreferrer">{post.title}</a></h2>
                        <p><em>{post.author.username}</em></p>
                        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getPostReadMore(post.content)) }} />
                        <a href={`/posts/${post.id}`} target="_blank" rel="noopener noreferrer">Read More</a>
                    </li>
                ))}
            </ul>
            {(totalPages > 1) && 
                Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1} onClick={() => loadMorePosts(index + 1)}>
                        {index + 1}
                    </button>
                ))
            }
        </div>
    );
}

export default MyBlogPost