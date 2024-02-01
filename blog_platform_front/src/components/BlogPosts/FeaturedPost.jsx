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
        return `${monthName} ${String(date.getDate() + 1).padStart(2, '0')}, ${date.getFullYear()}`;
    }

    return(
        <>
            {featuredPost && 
                <div>
                    <h2>{featuredPost.title}</h2>
                    <span><img src={featuredPost.image} alt={featuredPost.title}  /></span>
                    <span>{featuredPost.category.name}</span>
                    {featuredPost.tags.map((tag) => (
                        <span key={tag.name}>{tag.name}</span>
                    ))}
                    <span>{featuredPost.author.username}</span>
                    <span>{formatDate(featuredPost.updated_at)}</span>
                    <a href={`/posts/${featuredPost.author.username}/${featuredPost.id}/${featuredPost.slug}`}>Read More</a>
                </div>

            }
        </>
    )
}

export default FeaturedPost