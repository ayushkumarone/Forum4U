import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
    const experiences = experience.map((exp) => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">{exp.location}</td>
            <td>
                <Moment format="DD/MM/YYYY">{exp.from}</Moment> -{' '}
                {exp.to === null ? ' Now' : <Moment format="DD/MM/YYYY">{exp.to}</Moment>}
            </td>
            <td>
                <button onClick={() => deleteExperience(exp._id)} className="btn btn-danger">
                    <i className="fas fa-times"></i>
                </button>
            </td>
        </tr>
    ));

    return (
        <div>
            <h2 className="my-2">Experience Credentials</h2>
            {experiences.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th className="hide-sm">Title</th>
                            <th className="hide-sm">Location</th>
                            <th className="hide-sm">Years</th>
                            <th className="hide-sm" />
                        </tr>
                    </thead>
                    <tbody>{experiences}</tbody>
                </table>
            ) : (
                <p>You don't have experience</p>
            )}
        </div>
    );
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
