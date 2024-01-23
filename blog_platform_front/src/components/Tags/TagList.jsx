import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import {token, userData} from "../Auth/Token";
import AddTag from "./AddTag";

const TagList = () => {
    const [tagList, setTagList] = useState([])
    const [editTagId, setEditTagId] = useState(null)
    const [eidtTagName, setEditTagName] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] =useState('')

    // Get Tag List
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/tags`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setTagList(response.data)
        })
    }, [])

    const clearMessages = () => {
        setSuccess('')
        setError('')
    }
    
    const timeOutSuccess = (time = 5000) => {
        setTimeout(() => {
            setSuccess('');
        }, time);
    }

    const timeOutError = (time = 5000) => {
        setTimeout(() => {
            setError('');
        }, time);
    }

    const handleTagAdd = (newTag) => {
        setTagList((prevTagList) => [...prevTagList, newTag])
    }

    //Check for already Existing Tag
    const alreadyExisit = (tagName) => {
        const isNameAlreadyExist = tagList.some(tag => 
            tag.name.toLowerCase() === tagName.toLowerCase()
        );
        
        console.log("isNameAlreadyExist:", isNameAlreadyExist);
        if(isNameAlreadyExist){
            setError(`Tag "${tagName}" name already exists.`)
            timeOutError()
            return true
        }
        
        return false
    }

    const checkForNull = (tagName) => {
        if (tagName === null || tagName.trim() === ''){
            setError(`Tag cannot be null.`)
            timeOutError()
            return true
        }
        return false
    }

    //Edit Tag
    const handleEditClick = (tagId, tagName) => {
        clearMessages()
        setEditTagId(tagId)
        setEditTagName(tagName)
    }
    
    const handleSaveEditClick = (tagId) => {
        clearMessages()
        const isExist = alreadyExisit(eidtTagName)
        const isNull = checkForNull(eidtTagName)
        
        if(!isExist && !isNull){
            axios.put(`${API_BASE_URL}/api/tags/${tagId}/`, 
            { name: eidtTagName },
            {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(response => {
                const updateTagList = tagList.map(tag => {
                    if(tag.id === tagId){
                        return {...tag, name: eidtTagName}
                    }
                    return tag
                })
                setTagList(updateTagList)

                setEditTagId(null) 
                setEditTagName('')  

                setSuccess('Tag Updated Successfully..!')
                timeOutSuccess()         
            })
            .catch(error => {
                setError(`Error updating tag: ${error}`)
            })
        }else{
            setEditTagId(null)
        }
    }

    const handleCancelEditClick = () => {
        clearMessages()
        setEditTagId(null)
    }

    //Delete Tag
    const handleDeleteClick = (tagId, tagName) => {
        clearMessages()
        const confirmDelete = window.confirm(`PLEASE BEWARE..!!! Are you sure you want to delete "${tagName}" tag? This will make all the post with this tag moves to "Untaged" list.`)
        if(confirmDelete){
            axios.delete(`${API_BASE_URL}/api/tags/${tagId}`,
                { 
                    headers : { Authorization: `Token ${token}`}
                }
            ).then(response => {
                
                setTagList(prevTagList => prevTagList.filter(tag => tag.id !== tagId))

                setSuccess(`"${tagName} "Catergory is deleted successfully..! All the post with this tag moves to "Untaged" list.`)
                timeOutSuccess() 
            }).catch(error => {
                setError(`Error deleting catergory: ${tagName}: ${error}`)
                console.log(`Error deleting catergory: ${tagName}: ${error}`)
            })
        }
    }
    return(
        <div>
            <h1>Tags</h1>
            {success && <div>{success}</div>}
            {error && <div>{error}</div>}
            <AddTag onAddTag={handleTagAdd} />
            <ul>
                {tagList.map(tag => (
                    (tag.name !== 'Untaged') &&
                    <li key={tag.id}>
                        {editTagId && (editTagId === tag.id)
                        ? 
                            <div>
                                <input type="text" value={eidtTagName} onChange={(e) => setEditTagName(e.target.value)} />
                                <button onClick={() => handleSaveEditClick(tag.id, tag.name)}>Save</button>
                                <button onClick={handleCancelEditClick}>Cancel</button>
                            </div>
                        :     
                            <div>                      
                                <span>{tag.name}</span>
                                <span>{tag && token && (userData.id === tag.author) && <button onClick={() => handleEditClick(tag && tag.id, tag && tag.name)}>Edit</button>}</span>
                                <span>{tag && token && (userData.id === tag.author) && <button onClick={() => handleDeleteClick(tag && tag.id, tag && tag.name)}>Delete</button>}</span>
                            </div>
                        }                        
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TagList