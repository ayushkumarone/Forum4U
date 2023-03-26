import axios from 'axios';
import { setAlert } from './alert';
import {
    DELETE_POST,
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    ADD_POST,
    GET_POST,
    ADD_COMMENT,
    UPDATE_COMMENT_LIKES,
    REMOVE_COMMENT,
    MADE_PUBLIC,
} from './types';

// Get posts
export const getPosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Get user posts
export const getUserPosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/posts/my');

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Get user posts
export const getAUserPosts = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/posts/userposts/${id}`);

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Make post public
export const makePublic = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/public/${id}`);

        dispatch({
            type: MADE_PUBLIC,
            payload: res.data,
        });

        getPosts();
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Add like
export const addLike = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
        dispatch(setAlert('Post liked', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data },
        });
        dispatch(setAlert('Like removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
    if (window.confirm('Post is going to be deleted. Are you sure? ')) {
        try {
            await axios.delete(`/api/posts/${id}`);

            dispatch({
                type: DELETE_POST,
                payload: id,
            });

            dispatch(setAlert('Post Removed', 'success'));
        } catch (err) {
            dispatch({
                type: POST_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status },
            });
        }
    } else {
        dispatch(setAlert('Post not deleted'));
    }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const res = await axios.post('/api/posts', formData, config);

        dispatch({
            type: ADD_POST,
            payload: res.data,
        });

        dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Get particular post
export const getPost = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Add Comments
export const addComment = (postID, formData) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    try {
        const res = await axios.post(`/api/posts/comment/${postID}`, formData, config);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data,
        });

        dispatch(setAlert('Comment Created', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Add Comment like
export const addCommentLike = (id, comment_id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/like/${id}/${comment_id}`);

        dispatch({
            type: UPDATE_COMMENT_LIKES,
            payload: { comment_id, likes: res.data },
        });
        dispatch(setAlert('Comment liked', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Remove Comment like
export const removeCommentLike = (id, comment_id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}/${comment_id}`);

        dispatch({
            type: UPDATE_COMMENT_LIKES,
            payload: { comment_id, likes: res.data },
        });
        dispatch(setAlert('Like removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};

// Delete Comment
export const deleteComment = (postID, commentId) => async (dispatch) => {
    try {
        await axios.delete(`/api/posts/comment/${postID}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId,
        });

        dispatch(setAlert('Comment removed', 'success'));
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        });
    }
};
