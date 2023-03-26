import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
    useEffect(() => {
        getProfiles();
    }, [getProfiles]);
    return (
        <Fragment>
            {loading ? (
                <Spinner />
            ) : (
                <div className="purplebgscroll">
                    <section className="container-padding">
                        <h1 className="large /*text-primary*/">Users</h1>
                        <p className="lead">
                            <i className="fab fa-connectdevelop"></i> View the community members
                        </p>
                        <div className="profiles">
                            {profiles.length > 0 ? (
                                profiles.map((profile) => (
                                    <ProfileItem key={profile._id} profile={profile} />
                                ))
                            ) : (
                                <h4> No profiles found</h4>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </Fragment>
    );
};

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
