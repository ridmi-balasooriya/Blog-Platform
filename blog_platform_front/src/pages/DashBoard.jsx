import React, { useEffect, useState } from "react";
import {token} from "../components/Auth/Token";
import HomeButton from "../components/PageButtons/HomeButton";
import LogOut from "../components/Auth/LogOut";
import BlogPostForm from "../components/BlogPosts/BlogPostForm";
import MyBlogPost from "../components/BlogPosts/MyBlogPosts";
import CategoryList from "../components/Categories/CategoryList";
import TagList from "../components/Tags/TagList";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const DashBoard = () => {
    const [displayComponent, setDisplayComponent] = useState('create_post');
    const navigate = useNavigate();
    const location = useLocation();
    const postId = new URLSearchParams(location.search).get("postId");
        
    
    useEffect(() => {
        if(postId){
            setDisplayComponent('edit_post');
        }
    },[postId])
    
    
    const handleCreatePostClick = () => {
        navigate('/dashboard'); // Navigate to /dashboard
        setDisplayComponent('create_post')
    };
  
    return(
        <>
            {token && <HomeButton /> }
            {token && <LogOut /> }
            <div className="dashboard_div">
                <div className="dashboard_menu">
                    <ul>
                        <li><button onClick={handleCreatePostClick}>Create New Post</button></li>
                        <li><button onClick={() => setDisplayComponent('my_posts')}>My Posts</button></li>
                        <li><button onClick={() => setDisplayComponent('category_list')}>Categories</button></li>
                        <li><button onClick={() => setDisplayComponent('tag_list')}>Tags</button></li>
                        <li><button onClick={() => setDisplayComponent('my_profile')}>My Profile</button></li>
                    </ul>
                </div>
                <div>
                    {displayComponent === 'create_post' && <BlogPostForm />}
                    {displayComponent === 'edit_post' && <BlogPostForm postId={postId} />}
                    {displayComponent === 'my_posts' && <MyBlogPost />}
                    {displayComponent === 'category_list' && <CategoryList />}
                    {displayComponent === 'tag_list' && <TagList />}
                </div>

            </div>
        </>

    )
}

export default DashBoard;