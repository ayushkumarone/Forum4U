import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import PostForm from '../posts/PostForm';
import { getUserPosts } from '../../actions/post';

const MyPosts = ({ getUserPosts, post: { posts, loading } }) => {
    useEffect(() => {
        getUserPosts();
    }, [getUserPosts]);

    const [isOn, setOn] = useState({
        postingmode: false,
    });
    const { postingmode } = isOn;

    return loading ? (
        <Spinner />
    ) : (
        <div className="purplebgscroll">
            <section className="container-padding">
                <h1 className="large">My Posts</h1>
                <p className="lead">
                    <i className="fas fa-user" /> The public and private posts.
                </p>
                <div className="post-laptop">
                    {!postingmode && (
                        <div className="post-form-onoff">
                            <button
                                name="postingmode"
                                onClick={() => {
                                    setOn({ postingmode: !postingmode });
                                }}
                                className="post-button-open"
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span className="hide-sm"> New Post</span>
                            </button>
                        </div>
                    )}
                    {postingmode && (
                        <div className="post-form-sidebar">
                            <button
                                name="postingmode"
                                onClick={() => {
                                    setOn({ postingmode: !postingmode });
                                }}
                                className="post-button-close"
                            >
                                <i className="fa-solid fa-angle-right"></i>{' '}
                                <span className="hide-sm"> Collapse posting</span>
                            </button>
                            <PostForm />
                        </div>
                    )}
                </div>
                <div className="post-notlaptop">
                    <PostForm />
                </div>
                <div className="posts">
                    {posts.map((post) => (
                        <PostItem key={post._id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
};

MyPosts.propTypes = {
    getUserPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});
export default connect(mapStateToProps, { getUserPosts })(MyPosts);
