import React from "react";
import Layout from "../templates/Layout";
const NotFound = () => {
    return(
        <Layout>
            <h1>Page Not Found <br/> <i className="bi bi-dash-lg"></i></h1>
            <p>The requested page could not be found.</p>
        </Layout>
    );
}

export default NotFound