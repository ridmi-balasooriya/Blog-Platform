import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from '../../config';
import {token, userData} from "../Auth/Token";

const CategoryList = () => {
    const [categoryList, setCategoryList] = useState([])

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/categories`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(response => {
            console.log(response.data)
            setCategoryList(response.data)
        })
    }, [])

    const handleEditClick = () => {

    }

    const handleDeleteClick = () => {

    }
    return(
        <div>
            <h1>Categories</h1>
            <ul>
                {categoryList.map(category => (
                    <li>
                        <span>{category.name}</span>
                        <span>{category && token && (userData.id === category.author) && <button onClick={() => handleEditClick(category && category.id)}>Edit</button>}</span>
                        <span>{category && token && (userData.id === category.author) && <button onClick={() => handleDeleteClick(category && category.id)}>Delete</button>}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CategoryList;