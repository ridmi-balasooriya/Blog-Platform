import Layout from '../templates/Layout';
import BlogPostList from '../components/BlogPosts/BlogPostList';
import FeaturedPost from '../components/BlogPosts/FeaturedPost';

const HomePage = () => {
    return(
        <Layout>
            <FeaturedPost />
            <div>
                <span><img src="/tech_talk_logo-dark.png" alt='Tech Talk Logo' /></span>
                <p>
                    Welcome to Tech Talk, the dynamic hub for enthusiasts of computer science and technology. Our platform is not just about exploring the latest trends and innovations; it's a community where tech aficionados can read, write, and share their insights. Whether you're a professional, a student, or simply a tech lover, Tech Talk offers a space to engage with a diverse range of topics, from AI and cybersecurity to software development. Join us in shaping the conversation about technology's future – your voice matters here. Let's dive into the world of tech together at Tech Talk!
                </p>
            </div>
            <BlogPostList />
        </Layout>
    )
}


export default HomePage;