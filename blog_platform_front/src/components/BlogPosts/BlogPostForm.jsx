import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { token, userData } from '../Auth/Token';

const BlogPostForm = ({ postId }) => {
    const navigate = useNavigate()
    const id = postId
    const isEditing = !!id
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        category: {},
        tags: [],
        author: userData.id,
    })
    const [categories, setCategories]= useState([])
    const [tags, setTags]= useState([])
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [viewPostId, setViewPostId] = useState('')
    const [authorDetails,setAuthorDetails] = useState({})
    const [selectedImage, setSelectedImage] = useState(null);
    const [tagChecked, setTagChecked] = useState([])

    useEffect(() => {
        if(isEditing){
            setViewPostId(id)
            axios.get(`${API_BASE_URL}/api/posts/${id}`, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}})
            .then(response => {
                setFormData(response.data)
                setSelectedImage(response.data.image)
                setTagChecked(response.data.tags.map(tag => tag.id))
                
            })
            .catch(error => {
                setError(`Error fetching blog post: ${error}`)
                console.error(`Error fetching blog post: ${error}`);
            })
        }
                
        //Fetch Category List
        axios.get(`${API_BASE_URL}/api/categories`, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}})
        .then(response => {
            setCategories(response.data)
        })
        .catch(error => {
            setError(`Error fetching categories: ${error}`)
            console.error(`Error fetching categories: ${error}`);
        })

        //Fetch Tags
        axios.get(`${API_BASE_URL}/api/tags`, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}})
        .then(response => {
            setTags(response.data)
        })
        .catch(error => {
            setError(`Error fetching tags: ${error}`)
            console.error(`Error fetching tags: ${error}`);
        })

        //Fetch Author Details
        axios.get(`${API_BASE_URL}/api/users/${formData.author}`, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}})
        .then(response => {
            const fetchedAuthorDetails = response.data;
            setAuthorDetails(fetchedAuthorDetails)
            
        })
        .catch(error => {
            console.error(`Error fetching author data: ${error}`);
        });
        
    }, [isEditing, id]);

    const clearMessages = () => {
        setSuccess('')
        setError('')
    }
        
    const handleChangeTitle = (e) => {
        const { name, value} = e.target
        setFormData({
            ...formData,
            [name]: value,
        })    
    }

    const handleChangeCategory = (e) => {
        const { name, value} = e.target
        setFormData({
            ...formData,
            [name]: {id: value, name: e.innerText},
        })  
    }
    const handleTagChange = (tagId) => {
        setTagChecked((prevTagChecked) => {
            if(prevTagChecked.includes(tagId)){
                return prevTagChecked.filter((id) => id !== tagId)
            }else{
                return [...prevTagChecked, tagId]
            }
        })
    }

    const handleImageChange = (e) => {
        const image = e.target.files[0]
        setFormData({
            ...formData,
            image: image,
        })
        if (image) {
            const reader = new FileReader();        
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };    
            reader.readAsDataURL(image);
        } else {
            setSelectedImage(null);
        }
    }

    const handleContentChange = (newContent) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            content: newContent,
        }))
    }
    
    const handleSubmission = (e) => {
        e.preventDefault();
        clearMessages()
        
        if((!formData.title) || (!formData.content) || (!formData.category)){
            setError('Please fill in all required fields.')
            return
        }
        
        const postData = new FormData();
        postData.append('title', formData.title)
        postData.append('content', formData.content)  
        postData.append('author', formData.author)
        postData.append('category', formData.category.id)
        
        tagChecked.forEach((tagId) => {postData.append('tags', tagId)})

        if (typeof formData.image !== "string") {// If image is already exist it's in string if new one upload it's and fileobject. ONLY FILE OBJECTS can save in DB
            postData.append('image', formData.image)
        }
        
        if(id){
            //Update blog post
            axios.put(`${API_BASE_URL}/api/posts/${id}/`, postData, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}})
            .then(response => {
                setSuccess('Blog Post is Updated Successfully...');
                setViewPostId(response.data.id)
            })
            .catch(error => {
                setError(`Error updating blog post: ${error}`)
                console.error(`Error updating blog post: ${error}`);
            })
        }else{ 
            axios.post(`${API_BASE_URL}/api/posts/`, postData, {headers: {Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}})
            .then(response => {
                setSuccess('Blog Post is Created Successfully...');
                navigate(`/dashboard/?postId=${response.data.id}`)
            })
            .catch(error => {
                setError(`Error creating blog post: ${error}`)
                console.error(`Error creating blog post: ${error}`);
                console.error('Error response:', error.response)
            })
        }      
    }

    
    return(
        <div>
            <h1>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
            {error && <div>{error}</div>}
            {success && <div>{success}</div>}
            <div><em>Author: {authorDetails.username}</em></div>
            {viewPostId && <a href={`/posts/${viewPostId}`} target="_blank" rel="noopener noreferrer">View Post</a>}
            <form onSubmit={handleSubmission}>
                <div>
                    <label htmlFor='title'>Title</label>
                    <input type='text' name='title' value={formData.title} onChange={handleChangeTitle} />
                </div>
                <div>
                    <label htmlFor='category'>Category'</label>
                    <select name='category' onChange={handleChangeCategory} value={formData.category.id}>
                        <option value={null}>Please Select</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                        <label htmlFor='tags'>Tags</label>
                        {tags.map(tag => (
                            <label key={tag.id}>
                            <input type='checkbox' name='tags' id={`tag${tag.id}`} value={tag.id} onChange={() => handleTagChange(tag.id)} checked={tagChecked.includes(tag.id)}/>                                                                                   
                                {tag.name}
                            </label>                           
                        ))}                    
                </div>
                <div>
                    <label htmlFor='image'>Blog Image </label>
                    {selectedImage ? (
                        <img src={selectedImage} alt="Selected thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        ) 
                        : ( 'Choose Image' )
                    }
                    <input type='file' name='image' accept='image/*' onChange={handleImageChange} />
                    
                </div>
                <div>
                    <label htmlFor='content'>Content</label>
                    <ReactQuill value={formData.content} onChange={handleContentChange} placeholder='Write your content here...' />
                </div>
                <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
            </form>
        </div>
    )
}

export default BlogPostForm