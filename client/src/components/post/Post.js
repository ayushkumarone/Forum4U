import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import { getPost } from '../../actions/post';

const Post = ({ getPost, post: { post, loading } }) => {
    const { id } = useParams();
    useEffect(() => {
        getPost(id);
    }, [getPost, id]);

    return loading || post === null ? (
        <Spinner />
    ) : (
        <div className="purplebgscroll">
            <section className="container-padding">
                <Link to="/posts" className="btn">
                    <i className="fa-solid fa-angle-left" /> Back To Posts
                </Link>
                <div
                    style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '1rem',
                        marginTop: '1rem',
                        paddingTop: '1.7px',
                        paddingBottom: '1.7px',
                    }}
                >
                    <PostItem post={post} showActions={false} />
                    <CommentForm postId={post._id} />
                </div>
                <div className="comments">
                    {post.comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} postId={post._id} />
                    ))}
                </div>
            </section>
        </div>
    );
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
