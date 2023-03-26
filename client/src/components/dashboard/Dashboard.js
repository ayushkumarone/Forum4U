import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import Spinner from '../layout/Spinner';
// import MyPosts from './MyPosts';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const Dashboard = ({
    getCurrentProfile,
    deleteAccount,
    auth: { user },
    profile: { profile, loading },
}) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile === null ? (
        <Spinner />
    ) : (
        <div className="purplebgscroll">
            <div className="main-container">
                <section className="container">
                    <div
                        style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <h1 className="large" style={{ marginBottom: '0' }}>
                                Dashboard
                            </h1>
                            <div className="lead">
                                <p style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                    <i className="fas fa-user" />
                                    <span style={{ padding: '0 4px' }}></span> Welcome{' '}
                                    {user && user.name}
                                </p>
                            </div>
                        </div>
                        <img className="round-img dashboard-pic" src={user && user.avatar} alt="" />
                    </div>
                    {profile !== null && profile.status != null ? (
                        <Fragment>
                            <DashboardActions />
                            <Experience experience={profile.experience} />
                            <Education education={profile.education} />
                            <div className="my-2">
                                <button
                                    onClick={(e) => deleteAccount(user.name)}
                                    className="btn btn-danger"
                                >
                                    <i className="fas fa-user-minus"></i> Delete account
                                </button>
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <p>You have not yet setup your profile, please setup your profile.</p>
                            <Link to="/profile-form" className="btn btn-primary my-1">
                                Create Profile
                            </Link>
                        </Fragment>
                    )}
                </section>
                {/* <div className="post-chamber">
                    <MyPosts />
                </div> */}
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
