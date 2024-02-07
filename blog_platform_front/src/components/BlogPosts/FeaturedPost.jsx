import React, {useState, useEffect} from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const FeaturedPost = () => {
    const [featuredPost, setFeaturedPost] = useState()

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/featuredpost`)
        .then(response => {
            setFeaturedPost(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
        const monthIndex = date.getMonth()
        const monthName = monthNames[monthIndex]
        return `${monthName} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    }

    return(
        <>
            {featuredPost && 
                <div className="featured-post position-relative mb-5" style={{backgroundImage: `url(/featured-article-bg.jpg)`}}>
                    <div className="featured-post-overlay"></div>
                    <div className="featured-post-content container d-flex flex-row justify-content-evenly align-items-center" style={{ height: '100%' }}>
                        <div className="d-flex flex-column text-center">         
                            <h3 className="pb-0 text-md-start">Featured Article</h3>
                            <span className="pb-3 text-md-start">{featuredPost.category.name}</span>                   
                            <div className="featured-title text-center">
                                <h2 className="py-0">{featuredPost.title}</h2>
                                <span className="d-block text-md-end pb-2">
                                    {featuredPost.author_profile.author.first_name} {featuredPost.author_profile.author.last_name} - {formatDate(featuredPost.updated_at)}
                                </span>
                                <div className="m-auto center text-md-end pb-2">
                                    {featuredPost.tags.map((tag, index) => 
                                        <span key={index}>
                                            <span key={tag.name} className="badge"> {tag.name} </span> 
                                            <span className="badge">{index < featuredPost.tags.length - 1 && '|'}</span>
                                        </span>
                                    )}                      
                                </div>                                                                
                                <span className="d-block text-md-end">
                                    <a href={`/posts/${featuredPost.author.username}/${featuredPost.id}/${featuredPost.slug}`} className="btn btn-light">Read Article</a>
                                </span> 
                            </div> 
                        </div>    
                    </div>
                </div>

            }
        </>
    )
}

export default FeaturedPost