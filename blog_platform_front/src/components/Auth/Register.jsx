import React, { useState} from "react";
import { Link } from 'react-router-dom'
import axios from "axios";
import API_BASE_URL from "../../config";
import Layout from '../../templates/Layout';

const Register = () => {
    const [formData, setFormData] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'username': '',
        'password': '',
        'confirm_password': '',
        
        
    })
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const formSubmission = async (e) => {
        e.preventDefault();
        if(formData.password !== formData.confirm_password){
            setError('Passwords does not match.!')
            return;
        }
        const hasNullOrEmpytValue = Object.values(formData).some(value => value === null || value === undefined || value === '');
        if(hasNullOrEmpytValue){
            setError('Please fill in all required fields.')
            return;
        }
        try{
            await axios.post(`${API_BASE_URL}/api/register`, formData);
            window.location.href = '/login';
        }catch(error){
            if(error.response.status === 400){
                const errorData = error.response.data;
                console.log(errorData)
                if(errorData.username){                    
                    setError(`Registration Failed: ${errorData.username[0]}`)
                }
                if(errorData.email){
                    setError(`Registration Failed: ${errorData.email[0]}`)
                }
                
            }else{
                setError(`Registration Failed: ${error}`)
            }
        }
        
    }

    return(
        <Layout>
                <div className="container text-center signin-div">
                <h1 className="my-5">Register <br/> <i className="bi bi-dash-lg"></i></h1>
                {error && <div className="alert alert-danger d-inline-block register-error">{error}</div>}
                <form onSubmit={formSubmission}>
                    <div class="row justify-content-center">
                        <div class="col-md-6 col-12">
                            <input type='text' name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
                        </div>
                        <div class="col-md-6 col-12">
                            <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
                        </div>
                        <div class="col-md-6 col-12">
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                        </div>
                        <div class="col-md-6 col-12">
                            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} /> 
                        </div>
                        <div class="col-md-6 col-12">
                            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div class="col-md-6 col-12">
                            <input type="password" name="confirm_password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange} />
                        </div>
                        <div class="col-12">
                            <button type="submit" className="btn btn-dark mt-2 mb-4">Sign Up</button>
                        </div>
                    </div>
                </form>
                <div>Already a member? <Link to='/login'>Login here.</Link></div>
            </div>
        </Layout> 
    )
}

export default Register
