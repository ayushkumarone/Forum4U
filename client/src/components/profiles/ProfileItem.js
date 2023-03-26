import React from 'react';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProfileItem = ({
    auth,
    profile: {
        user: { _id, name, avatar },
        status,
        company,
        location,
        skills,
        online,
    },
    setAlert,
}) => {
    const triggerAlert = async (e) => {
        setAlert('Login or register to view a Profile');
    };
    return (
        <div className="profile bg-light">
            <img src={avatar} alt="" className="round-img" />
            <div>
                {auth.isAuthenticated && auth.loading === false && auth.user._id === _id ? (
                    <h1 style={{ fontSize: 20, fontWeight: 600 }}>
                        {name} (You)
                        {/* {' '}
                        {online.status && (
                            <span style={{ color: 'green', fontSize: 25 }}> {'   '}● </span>
                        )} */}
                    </h1>
                ) : (
                    <h1 style={{ fontSize: 20, fontWeight: 600 }}>
                        {name}
                        {/* {' '}
                        {online.status && (
                            <span style={{ color: 'green', fontSize: 25 }}> {'   '}● </span>
                        )} */}
                    </h1>
                )}
                <h4>
                    {online.status ? (
                        <span style={{ color: 'green', fontSize: 15 }}> {'   '} Online Now </span>
                    ) : (
                        <span style={{ fontSize: 15 }}>Last visited: {online.lastvisited}</span>
                    )}
                </h4>
                <p>
                    {status} {company && <span> at {company}</span>}
                </p>
                <p className="my-1">{location && <span>{location}</span>}</p>
                {auth.isAuthenticated && auth.loading === false ? (
                    <Link to={`/profile/${_id}`} className="btn btn-primary">
                        View Profile
                    </Link>
                ) : (
                    <Link to="/" onClick={(e) => triggerAlert(e)} className="btn btn-primary">
                        View Profile
                    </Link>
                )}

                {/* {auth.isAuthenticated && auth.loading === false && !(auth.user._id === _id) && (
                    <Link to="/" onClick={(e) => triggerAlert(e)} className="btn btn-primary">
                        Follow
                    </Link>
                )} */}
            </div>
            <ul>
                {skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="text-primary">
                        <i className="fas fa-check" /> {skill}
                    </li>
                ))}
            </ul>
        </div>
    );
};

ProfileItem.propTypes = {
    setAlert: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { setAlert })(ProfileItem);
