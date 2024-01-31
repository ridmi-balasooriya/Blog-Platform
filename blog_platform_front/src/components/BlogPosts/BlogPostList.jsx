import React, { useState, useEffect} from "react";
import axios from "axios";
import DOMPurify from 'dompurify';
import API_BASE_URL from '../../config';
// import LoginButton from "../Auth/LoginButton"
// import LogOut from "../Auth/LogOut";
// import {token} from "../Auth/Token";
// import DashboadButton from "../PageButtons/DashboardButton";
import { useParams, Link } from 'react-router-dom';

const BlogPostList = () => {
    const [posts, setPosts] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('title');
    const [nextPage, setNextPage] = useState([]);
    const [totalPages, setTotalPage] = useState(1)
    const { successMsg } = useParams();
    
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/postlist?search=${searchInput}&type=${searchType}`)
        .then(response => {
            setPosts(response.data.results)
            setNextPage(response.data.next);
            setTotalPage(Math.ceil(response.data.count/response.data.results.length))
        })
        .catch(error => {
            alert(`Error fetching blog posts:
            ${error}`);
        })
    }, [searchInput, searchType])

   
    const loadMorePosts = (pageNum) => {
        if (nextPage) {
            axios.get(`${API_BASE_URL}/api/postlist?page=${pageNum}&search=${searchInput}&type=${searchType}`)
            .then(response => {
                setPosts(response.data.results);
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

    return(
        <>
            {/* <div>{token 
            ? <> <DashboadButton />  <LogOut /> </>
            : <LoginButton /> }
            </div> */}
            <div>
                <select name="search_type" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value='title'>Title</option>
                    <option value='category'>Category</option>
                </select>
                <input type="text" name="search" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
            </div>
            <h1>Articles</h1>
            {successMsg && <div>{successMsg}</div>}
            <div>
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <h1><a href={`/posts/${post.author.username}/${post.id}/${post.slug}`}>{post.title}</a></h1>
                            <div>
                                {
                                    post.author_profile
                                    ? <img src={post.author_profile.profile_pic} alt={post.author.username} width='40px' height='40px' />
                                    : <span>{post.author.username.charAt(0)}</span>                                
                                }
                                
                                <Link to={`/author/${post.author.id}`}><em>{post.author.username}</em></Link>
                            </div>
                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getPostReadMore(post.content)) }} />
                            <a href={`/posts/${post.author.username}/${post.id}/${post.slug}`}>Read More</a>
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
        </>
    )
}

export default BlogPostList;