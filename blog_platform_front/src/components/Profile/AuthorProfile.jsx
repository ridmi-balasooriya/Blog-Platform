import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config";
import { token } from "../Auth/Token";
import DOMPurify from 'dompurify';

const AuthorProfile = () => {
    const { id } = useParams();
    const [authorProfile, setAuthorProfile] = useState({
        profile_pic: '',
        bio: '',
        first_name: '',
        last_name:''
    });
    const [authorPosts, setAuthorPosts] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/author_profile/?author=${id}`,
            {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}
        })
        .then(response => {
            setAuthorProfile(response.data[0])
        }).catch(error => {
            console.log(error)
        })

        axios.get(`${API_BASE_URL}/api/postlist?author=${id}`)
        .then(response => {
            setAuthorPosts(response.data.results)
        }).catch(error => {
            console.log(error)
        })
    },[])

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
        {authorProfile ?
            <div>
                <div>
                    {authorProfile.profile_pic ? 
                        <img src={authorProfile.profile_pic} alt={`${authorProfile.first_name} ${authorProfile.last_name}`} />
                        : <div>{authorProfile.first_name.charAt(0)}</div>
                    }
                </div>
                <h1>{authorProfile.first_name} {authorProfile.last_name}</h1>
                {authorProfile.profile_pic && <div>{authorProfile.bio}</div>}
                <div>
                    <h2>Author Articles</h2>
                    <ul>
                        {authorPosts && authorPosts.map(post => (
                        <li key={post.id}>
                            <h1><a href={`/posts/${post.id}`}>{post.title}</a></h1>
                            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getPostReadMore(post.content)) }} />
                            <a href={`/posts/${post.id}`}>Read More</a>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        :   <div>Author Profile is Not Available.!</div>
        }            
        </>
    );
}

export default AuthorProfile;