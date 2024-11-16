import './index.css'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'

const SimilarJobItem = props => {
  const {similarJobItemDetails} = props
  return (
    <li className="similar-job-item-container">
      <div className="job-details-company-logo-role-rating-container">
        <img
          src={similarJobItemDetails.companyLogoUrl}
          className="job-details-companylogo mr-3"
          alt="similar job company logo"
        />
        <div className="job-details-job-role-rating-container">
          <h1 className="job-details-job-title mb-3">
            {similarJobItemDetails.jobTitle}
          </h1>
          <div className="d-flex flex-row">
            <FaStar className="star-icon-job-details mr-1" />
            <p className="job-details-rating mb-0">
              {similarJobItemDetails.rating}
            </p>
          </div>
        </div>
      </div>
      <div className="similar-item-desc-container">
        <h1 className="similar-item-desc-heading-text mb-3">Description</h1>
        <p className="similar-item-job-desc">{similarJobItemDetails.jobDesc}</p>
      </div>
      <div className="job-details-location-job-type-container d-flex flex-row">
        <div className="job-details-location-container d-flex flex-row mr-4">
          <MdLocationOn className="job-details-location-job-type-icon mr-1" />
          <p>{similarJobItemDetails.jobLocation}</p>
        </div>
        <div className="job-details-type-container d-flex flex-row">
          <MdWork className="job-details-location-job-type-icon mr-2" />
          <p>{similarJobItemDetails.employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
