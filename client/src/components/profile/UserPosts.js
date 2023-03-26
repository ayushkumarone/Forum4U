import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import { getAUserPosts } from '../../actions/post';

const UserPosts = ({ getAUserPosts, post: { posts, loading } }) => {
    const { id } = useParams();
    useEffect(() => {
        getAUserPosts(id);
    }, [getAUserPosts, id]);

    return loading ? (
        <Spinner />
    ) : (
        <div>
            {posts.map((post) => (
                <PostItem key={post._id} post={post} />
            ))}
        </div>
    );
};

UserPosts.propTypes = {
    getAUserPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    post: state.post,
});
export default connect(mapStateToProps, { getAUserPosts })(UserPosts);
