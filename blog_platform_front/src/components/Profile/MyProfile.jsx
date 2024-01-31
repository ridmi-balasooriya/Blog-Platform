import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import API_BASE_URL from "../../config";
import { token, userData } from "../Auth/Token";

const MyProfile = () => {
    const [userProfile, setUserProfile] = useState({
        username: userData.username,
        email: '',
        first_name: '',
        last_name:'',
    });
    const [authorProfile, setAuthorProfile] = useState({
        author:userData.id,
        first_name: '',
        last_name:'',
        profile_pic:'',
        bio:''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [hasProfile, setHasProfile] = useState(true);
    const [editInput, setEditInput] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/users/${userData.id}`,
            {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}}
        ).then(response => {
            setUserProfile(response.data)            
        }).catch(error => {
            console.log(`Error: Retrieving User Profile ${error}`)
        })
        axios.get(`${API_BASE_URL}/api/author_profile/${userData.id}`,
        {headers: {Authorization: `Token ${token}`, 'Content-Type': 'application/json',}}
        ).then(response => {
            setAuthorProfile(response.data)
            setSelectedImage(response.data.profile_pic)
        }).catch(error => {
            console.log(`Error: Retrieving Author Profile ${error}`)
            if(error.response.status === 404){
                setHasProfile(false)
            }
        })
    },[])


    useEffect(() => {        
        if(!hasProfile){
            const postData = new FormData();
            postData.append('author', userData.id)
            postData.append('first_name', userProfile.first_name)
            postData.append('last_name', userProfile.last_name)

            axios.post(`${API_BASE_URL}/api/author_profile/`, postData, 
                {headers: {Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',} }
            ).then(response => {
                setAuthorProfile(response.data)
                console.log(response.data)
            }).catch(error => {
                console.log(error)
            })
        }
    },[hasProfile, userProfile.first_name, userProfile.last_name])

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
    

    const hanldeChange = (e) => {
        const {name, value} = e.target
        setAuthorProfile({
            ...authorProfile,
            [name]: value
        })
    }

    const handleImageChange = (e) => {
        const profilePic = e.target.files[0]
        setAuthorProfile({
            ...authorProfile,
            profile_pic: profilePic,
        })
        if (profilePic) {
            const reader = new FileReader();        
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };    
            reader.readAsDataURL(profilePic);
        } else {
            setSelectedImage(null);
        }
    }
            

    const handleSaveEditClick = () => {        
        const postData = new FormData();
        authorProfile.bio && postData.append('bio', authorProfile.bio)
        postData.append('first_name', authorProfile.first_name)
        postData.append('last_name', authorProfile.last_name)
        if ((typeof authorProfile.profile_pic !== "string") && (authorProfile.profile_pic !== null)) {
            // If proflie is already exist it's in string if new one upload it's and fileobject. ONLY FILE OBJECTS can save in DB
            postData.append('profile_pic', authorProfile.profile_pic)
        }

        axios.put(`${API_BASE_URL}/api/author_profile/${userData.id}/`, postData,
        {headers: {Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data',}}
        ).then(response => {
            setAuthorProfile(response.data)
            setEditInput('')
            setSuccess('Profie Updated Successfully..!')
            timeOutSuccess();
        }).catch(error => {
            setError('Error Updating Proflie..!!')
            console.log(`Error: Updating Author Profile ${error}`)
            timeOutError();
        })
    }

    return(
        <>
            <h1>My Profile</h1>
            <div>
                {success && <div>{success}</div>}
                {error && <div>{error}</div>}
                {editInput === 'profile_pic' 
                    ? <span>
                            {selectedImage ? (
                                <img src={selectedImage} alt="Selected thumbnail" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                ) 
                                : ( 'Choose Image' )
                            }
                            <input type='file' name='image' accept='image/*' onChange={handleImageChange} />
                            <button onClick={() => handleSaveEditClick()}>Save</button>
                            <button onClick={() => setEditInput('')}>Cancel</button>
                      </span>
                    : <>
                            {authorProfile.profile_pic 
                            ?   <span>
                                    <img src={authorProfile.profile_pic} width='150px' height='100px' alt={`${authorProfile.first_name} ${authorProfile.last_name}`} />
                                    <button onClick={() => setEditInput('profile_pic')}>Edit</button>
                                </span>
                            :   <span>
                                    <button onClick={() => setEditInput('profile_pic')}>Add Profile Picture</button>
                                </span>
                            }
                            
                      </>
                }
                
            </div>
            <div>
                {editInput === 'bio' 
                    ? <span>
                        <textarea name="bio" onChange={hanldeChange}>{authorProfile.bio}</textarea>
                        <button onClick={() => handleSaveEditClick()}>Save</button>
                        <button onClick={() => setEditInput('')}>Cancel</button>
                     </span>
                    : <>
                            {authorProfile.bio && authorProfile.bio !== 'null'
                            ?   <span>
                                    {authorProfile.bio}
                                    <button onClick={() => setEditInput('bio')}>Edit</button>
                                </span>
                            :   <span>
                                    <button onClick={() => setEditInput('bio')}>Add Bio</button>
                                </span>
                            }                    
                    </>                    
                }
            </div>            
            <div>
                <label htmlFor="first_name">Name:</label>
                {editInput === 'name' 
                    ? <span>
                        <input type="text" name="first_name" value={authorProfile.first_name} onChange={hanldeChange} />
                        <input type="text" name="last_name" value={authorProfile.last_name} onChange={hanldeChange} />
                        <button onClick={() => handleSaveEditClick()}>Save</button>
                        <button onClick={() => setEditInput('')}>Cancel</button>
                    </span>
                    : <span>
                        <span>{authorProfile.first_name} {authorProfile.last_name}</span>
                        <button onClick={() => setEditInput('name')}>Edit</button>
                    </span>
                }               
            </div>
            <div>
                <label htmlFor="username">UserName:</label>
                <span>{userProfile.username}</span>
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <span>{userProfile.email}</span>
            </div>
            <div><Link to='/password_reset'>Change Your Password?</Link></div>            
        </>
    );
}

export default MyProfile