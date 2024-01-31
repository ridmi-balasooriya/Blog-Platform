import Layout from '../templates/Layout';
import BlogPostList from '../components/BlogPosts/BlogPostList';

const HomePage = () => {
    return(
        <Layout>
            <BlogPostList />
        </Layout>
    )
}


export default HomePage;