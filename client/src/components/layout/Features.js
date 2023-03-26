import React from 'react';

const Features = (props) => {
    return (
        <div className="purplebgscroll">
            <div className="container-padding">
                <h1 className="large">Features</h1>
                <p className="lead">
                    <i className="fa-solid fa-star" /> The platform consists of several features
                    such as
                </p>
                <div className="features-list">
                    <p>
                        • Create your profile and interact with other users with similar idealogies.
                    </p>{' '}
                    <p>
                        • The user that has created a post or comment can delete it using the{' '}
                        <button type="button" className="btn btn-danger">
                            <i className="fas fa-times"></i>
                        </button>
                        button.{' '}
                    </p>{' '}
                    <p>
                        {' '}
                        • Choose whether to make a post private or public by checking the{'  '}
                        <span>
                            <input type="checkbox" name="visibility" /> Private
                        </span>{' '}
                        checkbox.
                    </p>{' '}
                    <p>
                        • If a post is made private the owner can make the post public by clicking
                        on
                        {'  '}
                        <button type="button" className="btn btn-success">
                            <i className="fa-solid fa-eye"></i>{' '}
                            <span className="hide-sm"> Make Public</span>
                        </button>
                        button.
                    </p>
                </div>
                <br />
                <br />
                <p className="lead" style={{ textAlign: 'center' }}>
                    Enjoy the experience.
                </p>
            </div>
        </div>
    );
};

export default Features;
