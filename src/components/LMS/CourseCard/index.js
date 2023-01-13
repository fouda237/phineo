import 'moment/locale/fr';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import For from '../../../assets/images/wab_formation.jpg'
const CourseCard = ({ value }) => {
    const date = Date.now()
    const beginDate = Math.floor(new Date(value.assignments[0].beginDate).getTime())


    return( 
        <div
            className="col-md-4 same-height"
            key={value.id}
        >
            <div className="card w-100 p-0 shadow-xss border-0 rounded-lg overflow-hidden mr-1 course-card mb-4">
                <div className="card-image formations">
                    {beginDate < date ? (
                        <Link
                        to={`/formations/${value.id}`}
                        className="video-bttn position-relative d-block"
                        >
                        <img
                            src={For}
                            alt="course"
                            className="w-100"
                        />
                        </Link>
                    ) : (
                        <img
                            src={For}
                            alt="course"
                            className="w-100"
                        />
                    )}
                </div>

                <div className="card-body pt-0">
                    <h3 className="fw-700 font-s mt-3 lh-28 mt-0">

                    {beginDate < date ? (
                        <Link
                            to={`/formations/${value.id}`}
                            className="text-dark text-grey-900"
                        >
                            {value.title}
                        </Link>
                        ) : (
                            <>
                                <i className="feather-lock mr-1"></i> {value.title}
                            </>
                        )}
                    </h3>
                    <h6 className="font-xssss text-grey-500 fw-600 ml-0 mt-2">
                        {value.description.length > 90 ? value.description.substring(0, 90) + '...' : value.description}
                    </h6>

                    {beginDate < date ? (
                        <a
                            href={`/formations/${value.id}`}
                            className="mt-3 p-0 btn p-2 lh-24 w150 ls-3 d-inline-block rounded-xl bg-skype font-xssss fw-700 ls-lg text-white"
                        >
                            Y ALLER !
                        </a>
                    ) : (
                        <>
                            <h3 className="fw-700 font-xsss mt-3 mb-0 lh-28 mt-0">
                                Début de votre Formation :
                            </h3>
                            <h3 className="fw-700 font-xs mt-0 lh-28 mt-0">
                                <Moment format='dddd DD MMMM' style={{textTransform: 'capitalize'}}>{beginDate}</Moment> 
                            </h3>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseCard;
