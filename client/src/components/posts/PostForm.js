import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
    // const [text, setText] = useState('');
    const [formData, setFormData] = useState({
        text: '',
        visibility: false,
    });

    const { text, visibility } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form
                className="form my-1"
                onSubmit={(e) => {
                    e.preventDefault();
                    addPost({ text, visibility });
                    setFormData({ ...formData, text: '', visibility: false });
                }}
            >
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Create a post"
                    value={text}
                    onChange={onChange}
                    required
                />
                <input
                    type="checkbox"
                    name="visibility"
                    checked={visibility}
                    value={visibility}
                    onChange={() => {
                        setFormData({ ...formData, visibility: !visibility });
                    }}
                />{' '}
                Private
                <br />
                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    );
};

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
