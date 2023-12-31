import React, {useState, useEffect} from "react"
import axios from "axios"
import API_BASE_URL from "../../config"
import { token, userData } from "../Auth/Token"

const Like = ({postId}) => {
    const [likeList, setLikeList] = useState([])
    const [liked, setLiked] = useState({})
    const [formData, setFormData] = useState({
        'post': postId,
    })

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/likes/?postId=${postId}`,  
        {headers: {'Content-Type': 'application/json'}})
        .then(response => {
            const likes = response.data
            setLikeList(likes) 
            userData && setLiked(likes.some(like => like.author.username === userData.username))
        })
        .catch(error => {
            if(error.response && error.response.status === 404){
                setLikeList([])
            }else{
                console.log(`Likes retrieving Error: ${error}`)
            }           
        })
    },[postId, liked])

    const handleLikeSubmission = () => {
        if(liked){
            const likedToDelete = likeList.find(like => like.author.username === userData.username)
            const likedToDeleteId = likedToDelete.id
                        
            axios.delete(`${API_BASE_URL}/api/likes/${likedToDeleteId}/`,
                { 
                    headers : { Authorization: `Token ${token}`}
                }
            ).then(response => {
                setLikeList(prevlikeList => prevlikeList.filter(like => like.id !== likedToDeleteId))
                setLiked(false)
            }).catch(error => {
                console.log(`Error Unliking the Post ${error}`)
            })            
        }else{
            setFormData({
                ...formData,
                'author': userData.id
            })
            axios.post(`${API_BASE_URL}/api/likes/`, formData,
                {headers: {Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}}
            ).then(response => {
                const newLike = response.data
                setLikeList( [...likeList, newLike])
                userData && setLiked(newLike.author.username === userData.username)               
            })
            .catch(error => {
                console.log(`Error Liking the Post: ${error}`)
            })
        }      
    }

    return(
        <div>
            {(likeList.length > 0) && <span>{likeList.length} &#x1F44D;</span>}
            {token && <button onClick={handleLikeSubmission}>LIKE{liked && <span>D</span>}</button> }
        </div>
    )
}

export default Like
