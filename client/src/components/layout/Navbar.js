import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
    const authLinks = (
        <ul>
            <li>
                {user && (
                    <Link to={`/dashboard`} className="user-profile navbar-profile">
                        <span>{user.name}</span>
                        <span>
                            <img src={user.avatar} alt="" />
                        </span>
                    </Link>
                )}
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li className="btnborderless">
                <Link to="/profiles">Users</Link>
            </li>
            <li className="btnborder">
                <Link to="register">Register</Link>
            </li>
            <li className="btnborder">
                <Link to="login">Login</Link>
            </li>
        </ul>
    );

    return (
        <Fragment>
            <nav className="navbar bg-dark">
                <h1 style={{ fontSize: 42 }} className="fonttitle">
                    <Link to="/">
                        <i className="fa-regular fa-comment-dots" /> Forum4U
                    </Link>
                </h1>
                {!loading && <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>}
            </nav>
        </Fragment>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
