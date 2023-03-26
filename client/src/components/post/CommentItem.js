import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteComment, addCommentLike, removeCommentLike } from '../../actions/post';

const CommentItem = ({
    postId,
    comment: { _id, text, name, avatar, user, likes, date },
    auth,
    addCommentLike,
    removeCommentLike,
    deleteComment,
}) => (
    <div className="post bg-white p-1 my-1">
        <div>
            <Link to={`/profile/${user}`}>
                <img className="round-img" src={avatar} alt="" />
                <h4>{name}</h4>
            </Link>
        </div>
        <div>
            <p className="my-1">{text}</p>
            <p className="post-date">
                Posted on <Moment format="DD/MM/YYYY">{date}</Moment>
            </p>
            <button onClick={(e) => addCommentLike(postId, _id)} type="button" className="likebtn">
                <i className="fa-solid fa-caret-up"></i>
            </button>
            <span>{likes.length}</span>
            <button
                onClick={(e) => removeCommentLike(postId, _id)}
                type="button"
                className="unlikebtn"
            >
                <i className="fa-solid fa-caret-down"></i>
            </button>
            {!auth.loading && user === auth.user._id && (
                <button
                    onClick={() => deleteComment(postId, _id)}
                    type="button"
                    className="btn btn-danger"
                >
                    <i className="fas fa-times" />
                </button>
            )}
        </div>
    </div>
);

CommentItem.propTypes = {
    postId: PropTypes.string.isRequired,
    comment: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addCommentLike: PropTypes.func.isRequired,
    removeCommentLike: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { addCommentLike, removeCommentLike, deleteComment })(
    CommentItem
);
