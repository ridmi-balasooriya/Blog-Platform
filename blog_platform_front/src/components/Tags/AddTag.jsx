import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import {token, userData} from "../Auth/Token";

const AddTag = ({onAddTag}) => {
    const [tagList, setTagList] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        author: userData.id,
    })
    const [success, setSuccess] = useState('')
    const [error, setError] =useState('')

    // Get Tag List
    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/tags?search=${formData.name}`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            setTagList(response.data)
        })
    }, [formData.name])

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

    //Add New Tag
    const handleNewTag = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmission = (e) => {
        e.preventDefault();
        clearMessages()
        const isExist = alreadyExisit(formData.name)
        const isNull = checkForNull(formData.name)
        console.log(formData)
        if(!isExist && !isNull){
            axios.post(`${API_BASE_URL}/api/tags/`, 
                formData, 
                {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                }
            )
            .then(response => {
                setTagList([...tagList, response.data])
                onAddTag(response.data)
                setFormData({
                    name: '',
                    author: userData.id,
                })
                setSuccess('New Tag is Added Successfully..!')
                timeOutSuccess() 
            })
            .catch(error => {
                setError(`Error Adding New Tag: ${error}`)
            })
        }   
    }

    
    return(
        <div>
            {success && <div className="alert alert-success text-center"><i className="bi bi-check-circle me-1"></i> {success}</div>}
            {error && <div className="alert alert-danger text-center"><i class="bi bi-x-circle me-1"></i> {error}</div>}
            <form onSubmit={handleSubmission}>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleNewTag} />
                    <button type="submit"><i class="bi bi-plus"></i></button>
                </div>
            </form>
            {formData.name &&
                 <ul>
                    {tagList.map(tag => (
                        <li key={tag.id}><span>{tag.name}</span></li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default AddTag