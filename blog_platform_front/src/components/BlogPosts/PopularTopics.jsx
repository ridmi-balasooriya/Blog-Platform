import React, {useState, useEffect} from "react";
import axios from "axios"
import API_BASE_URL from "../../config"

const PopularTopics = () => {
    const [popularCategories, setPouplarCategories] = useState()
    
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/popular_categories`)
        .then(response => {
            setPouplarCategories(response.data)
        })
        .catch(error => {
            console.log(error)
        })
    },[])

    return(
        <div className="popular-topic mb-5">
            <h3 className="text-center py-2">Popular Topics <br/> <i className="bi bi-dash-lg"></i></h3>
            <div id="articlesCarousel" className="carousel slide" data-bs-ride="carousel">

                <div className="carousel-indicators">
                    {popularCategories && popularCategories.map((category, index) => (
                        <button 
                            key={category.id} 
                            type="button" 
                            data-bs-target="#articlesCarousel" 
                            data-bs-slide-to={index} 
                            className={index === 0 ? 'active' : ''} 
                            aria-current={index === 0 ? 'true' : ''} 
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                <div className="carousel-inner rounded">
                    {popularCategories && popularCategories.map((category, index) => (
                        <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={category.id}>
                            <img src={`${API_BASE_URL}${category.recent_post.image}`} className="d-block w-100 dark-image" alt={category.recent_post.title} height='350px' />
                            <div className="carousel-caption d-md-block">                                
                                <h5 className="mb-4">{category.name}</h5>
                                <h3 className="mb-4">{category.recent_post.title}</h3>
                                <a  href={`/posts/${category.recent_post.author.username}/${category.recent_post.id}/${category.recent_post.slug}`} className="btn btn-light stretched-link mb-5">Read Article</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PopularTopics;