import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import { getProfilebyID } from '../../actions/profile';
import ProfileEducation from './ProfileEducation';
import UserPosts from './UserPosts';

const Profile = ({ getProfilebyID, profile: { profile, loading }, auth }) => {
    const { id } = useParams();
    useEffect(() => {
        getProfilebyID(id);
    }, [getProfilebyID, id]);
    return (
        <div className="purplebgscroll">
            <section className="container-padding">
                {profile === null || loading ? (
                    <Spinner />
                ) : (
                    <Fragment>
                        <Link to="/profiles" className="btn btn-light">
                            <i className="fa-solid fa-angle-left"></i> Back to Profiles
                        </Link>
                        {auth.isAuthenticated &&
                            auth.loading === false &&
                            auth.user._id === profile.user._id && (
                                <Link to="/profile-form" className="btn btn-dark">
                                    Edit Profile
                                </Link>
                            )}
                        <div className="profile-grid my-1">
                            <ProfileTop profile={profile} />
                            <ProfileAbout profile={profile} />
                            <div className="profile-exp bg-white p-2">
                                <h2 className="text-primary">Experience</h2>
                                {profile.experience.length > 0 ? (
                                    <Fragment>
                                        {profile.experience.map((experience) => (
                                            <ProfileExperience
                                                key={experience._id}
                                                experience={experience}
                                            />
                                        ))}
                                    </Fragment>
                                ) : (
                                    <h4>No experience</h4>
                                )}
                            </div>
                            <div className="profile-edu bg-white p-2">
                                <h2 className="text-primary">Education</h2>
                                {profile.education.length > 0 ? (
                                    <Fragment>
                                        {profile.education.map((education) => (
                                            <ProfileEducation
                                                key={education._id}
                                                education={education}
                                            />
                                        ))}
                                    </Fragment>
                                ) : (
                                    <h4>No education</h4>
                                )}
                            </div>
                        </div>
                        <UserPosts />
                    </Fragment>
                )}
            </section>
        </div>
    );
};

Profile.propTypes = {
    getProfilebyID: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    auth: state.auth,
});

export default connect(mapStateToProps, { getProfilebyID })(Profile);
