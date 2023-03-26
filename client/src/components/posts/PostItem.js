import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost, makePublic } from '../../actions/post';

const PostItem = ({
    addLike,
    removeLike,
    deletePost,
    makePublic,
    auth,
    post: { _id, text, name, avatar, visibility, user, likes, comments, date },
    showActions,
}) => {
    return (
        <div className="post bg-white p-1 my-1">
            <div className="profile-picname">
                <Link to={`/profile/${user}`}>
                    <img className="round-img" src={avatar} alt="" />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">{text}</p>
                <p className="post-date">
                    Posted on <Moment format="DD/MM/YYYY">{date}</Moment>{' '}
                </p>
                {showActions && (
                    <Fragment>
                        <button onClick={(e) => addLike(_id)} type="button" className="likebtn">
                            <i className="fa-solid fa-caret-up"></i>
                        </button>
                        <span>{likes.length}</span>
                        <button
                            onClick={(e) => removeLike(_id)}
                            type="button"
                            className="unlikebtn"
                        >
                            <i className="fa-solid fa-caret-down"></i>
                        </button>
                        <Link to={`/posts/${_id}`} className="btn btn-primary">
                            <i className="fa-solid fa-comments"></i>{' '}
                            <span className="hide-sm">Comments </span>{' '}
                            <span className="comment-count">{comments.length}</span>
                        </Link>
                        {!auth.loading && user === auth.user._id && (
                            <button
                                onClick={(e) => deletePost(_id)}
                                type="button"
                                className="btn btn-danger"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                        {visibility && (
                            <button
                                onClick={(e) => makePublic(_id)}
                                type="button"
                                className="btn btn-success"
                            >
                                <i className="fa-solid fa-eye"></i>{' '}
                                <span className="hide-sm"> Make Public</span>
                            </button>
                        )}
                    </Fragment>
                )}
            </div>
        </div>
    );
};

PostItem.defaultProps = {
    showActions: true,
};

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    makePublic: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost, makePublic })(PostItem);
