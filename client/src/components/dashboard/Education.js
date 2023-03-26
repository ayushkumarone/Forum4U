import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

const Education = ({ education, deleteEducation }) => {
    const educations = education.map((edu) => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td className="hide-sm">{edu.fieldofstudy}</td>
            <td>
                <Moment format="DD/MM/YYYY">{edu.from}</Moment> -{' '}
                {edu.to === null ? ' Now' : <Moment format="DD/MM/YYYY">{edu.to}</Moment>}
            </td>
            <td>
                <button onClick={() => deleteEducation(edu._id)} className="btn btn-danger">
                    <i className="fas fa-times"></i>
                </button>
            </td>
        </tr>
    ));

    return (
        <div>
            <h2 className="my-2">Education Credentials</h2>
            {educations.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>School</th>
                            <th className="hide-sm">Degree</th>
                            <th className="hide-sm">Field Of Study</th>
                            <th className="hide-sm">Years</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>{educations}</tbody>
                </table>
            ) : (
                <p>You don't have education ? </p>
            )}
        </div>
    );
};

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
