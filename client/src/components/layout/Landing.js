import React, { Fragment } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import pic from '../../img/Untitled.webp';

const Landing = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <Fragment>
            <section className="landing">
                <div className="dark-overlay">
                    <div className="landing-inner">
                        <div className="landing-text">
                            <h1 className="x-large">Chat pe Charcha</h1>
                            <p className="lead">
                                An open Forum for sharing ideas and discussing about them.
                            </p>
                        </div>
                        <img src={pic} alt="" className="discussimg" />
                    </div>
                </div>
                <div className="features">
                    <div className="feature">
                        <h2 className="feature-heading">Socialize</h2>
                        <p>Socialize with users globally and share your thoughts.</p>
                    </div>
                    <div className="line-vertical"></div>
                    <div className="feature">
                        <h2 className="feature-heading">Comment</h2>
                        <p>Comment your thoughts on any post for everone to see.</p>
                    </div>
                    <div className="line-vertical"></div>
                    <div className="feature">
                        <h2 className="feature-heading">View Profiles</h2>
                        <p>Like a post? Visit the author and see his profile and other posts.</p>
                    </div>
                    <div className="line-vertical"></div>
                    <div className="feature">
                        <h2 className="feature-heading">Privacy</h2>
                        <p>
                            Not sure whether to post something or not? Simply make the message
                            private till sure.
                        </p>
                    </div>
                </div>
            </section>
            <section className="landing2">
                <div className="dark-overlay2">
                    <div className="dark-overlay-text">
                        {/* <h1 className="x-large">Social Share</h1> */}
                        <p className="lead1">
                            <span className="landing-blue-text">Sign Up</span> today for a great
                            community sharing experience, {'\u00A0\u00A0\u00A0\u00A0\u00A0'}
                            <br />
                            <span className="landing-blue-text">Create</span> your profile, ask
                            questions and share experiences with other users.
                        </p>
                        <div className="buttons">
                            <div className="btn-landing">
                                <Link to="register">Sign Up</Link>
                            </div>
                            <div className="btn-white-landing">
                                <Link to="login">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <div className="footer-img"></div>
                <div className="footer-text" style={{ textAlign: 'center' }}>
                    <div className="links">
                        <a href="#!">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="#!">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                        <a href="#!">
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a href="#!">
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                        <a href="#!">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                    <div className="footer-links">
                        <Link to="/">Home </Link>|<Link to="/features"> Features </Link>|
                        <a href="https://www.linkedin.com/in/ayushkumar3070/"> Contact</a>
                    </div>
                    <div className="footer-copyright">
                        <i className="fa-regular fa-copyright"></i> Made by Ayush Kumar
                    </div>
                </div>
            </footer>
        </Fragment>
    );
};

Landing.propTypes = {
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
