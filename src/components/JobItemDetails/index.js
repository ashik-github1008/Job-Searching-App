import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {FaExternalLinkAlt, FaStar} from 'react-icons/fa'
import {v4 as uuidv4} from 'uuid'

import Header from '../Header/index'
import SimilarJobItem from '../SimilarJobItem/index'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemDetails: {},
    similarJobItemList: [],
  }

  componentDidMount() {
    this.getJobItemData()
  }

  getJobItemData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const jobitemDetailsData = await response.json()
      const jobitemDetailsDataObj = jobitemDetailsData.job_details
      // console.log(jobitemDetailsDataObj)
      const updatedJobItemDetails = {
        id: jobitemDetailsDataObj.id,
        companyLogoUrl: jobitemDetailsDataObj.company_logo_url,
        companyWebsiteUrl: jobitemDetailsDataObj.company_website_url,
        title: jobitemDetailsDataObj.title,
        rating: jobitemDetailsDataObj.rating,
        location: jobitemDetailsDataObj.location,
        employmentType: jobitemDetailsDataObj.employment_type,
        package: jobitemDetailsDataObj.package_per_annum,
        jobDesc: jobitemDetailsDataObj.job_description,
        skills: jobitemDetailsDataObj.skills.map(eachSkill => ({
          id: uuidv4(),
          skillImageUrl: eachSkill.image_url,
          skillName: eachSkill.name,
        })),
        lifeAtCompany: {
          description: jobitemDetailsDataObj.life_at_company.description,
          imageUrl: jobitemDetailsDataObj.life_at_company.image_url,
        },
      }

      const similarJobItemData = jobitemDetailsData.similar_jobs
      const updatedSimilarJobItemData = similarJobItemData.map(
        eachSimilarItem => ({
          id: eachSimilarItem.id,
          companyLogoUrl: eachSimilarItem.company_logo_url,
          jobTitle: eachSimilarItem.title,
          rating: eachSimilarItem.rating,
          jobDesc: eachSimilarItem.job_description,
          jobLocation: eachSimilarItem.location,
          employmentType: eachSimilarItem.employment_type,
        }),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        jobItemDetails: updatedJobItemDetails,
        similarJobItemList: updatedSimilarJobItemData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemDetailsSuccessView = () => {
    const {jobItemDetails, similarJobItemList} = this.state
    return (
      <div className="job-details-container">
        <div className="job-details-main-container">
          <div className="job-details-company-logo-role-rating-container">
            <img
              src={jobItemDetails.companyLogoUrl}
              className="job-details-companylogo mr-3"
              alt="job details company logo"
            />
            <div className="job-details-job-role-rating-container">
              <h1 className="job-details-job-title mb-3">
                {jobItemDetails.title}
              </h1>
              <div className="d-flex flex-row">
                <FaStar className="star-icon-job-details mr-1" />
                <p className="job-details-rating mb-0">
                  {jobItemDetails.rating}
                </p>
              </div>
            </div>
          </div>
          <div className="job-details-location-job-type-package-container">
            <div className="job-details-location-job-type-container d-flex flex-row">
              <div className="job-details-location-container d-flex flex-row mr-4">
                <MdLocationOn className="job-details-location-job-type-icon mr-1" />
                <p>{jobItemDetails.location}</p>
              </div>
              <div className="job-details-type-container d-flex flex-row">
                <MdWork className="job-details-location-job-type-icon mr-2" />
                <p>{jobItemDetails.employmentType}</p>
              </div>
            </div>
            <p className="job-details-package-range">
              {jobItemDetails.package}
            </p>
          </div>
          <hr className="job-card-hr-line" />
          <div className="job-details-desc-heading-visit-link-container mb-4 mt-3">
            <h1 className="job-details-desc-heading">Description</h1>
            <a
              href={jobItemDetails.companyWebsiteUrl}
              target="_blank"
              className="visit-link-container d-flex flex-row"
            >
              <p className="visit-link-text mr-3">Visit</p>
              <FaExternalLinkAlt className="visit-link-icon" />
            </a>
          </div>
          <p className="job-item-details-desc">{jobItemDetails.jobDesc}</p>
          <div className="job-details-skills-container mt-4">
            <h1 className="job-details-skills-heading-text">Skills</h1>
            <ul className="skills-list-container mt-4">
              {jobItemDetails.skills.map(eachSkill => (
                <li key={eachSkill.id} className="skill-item-container mb-5">
                  <img
                    src={eachSkill.skillImageUrl}
                    alt={eachSkill.skillName}
                    className="skill-img mr-3"
                  />
                  <p className="mt-3">{eachSkill.skillName}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="life-at-company-container">
            <h1 className="life-at-company-heading mb-3">Life at Company</h1>
            <div className="life-at-company-desc-img-container">
              <p className="life-at-company-desc mr-5">
                {jobItemDetails.lifeAtCompany.description}
              </p>
              <img
                src={jobItemDetails.lifeAtCompany.imageUrl}
                alt="life at company"
                className="ml-4"
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading-text">Similar Jobs</h1>
          <ul className="similar-job-item-list-container mt-4">
            {similarJobItemList.map(eachSimilarItem => (
              <SimilarJobItem
                key={eachSimilarItem.id}
                similarJobItemDetails={eachSimilarItem}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoadingView = () => {
    console.log('render loading')
    return (
      <div className="job-details-loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  onClickJobFailureRetryBtn = () => {
    this.getJobItemData()
  }

  renderJobItemDetailsFailureView = () => {
    return (
      <div className="job-details-failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="mb-4"
        />
        <h1 className="mb-2">Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for.</p>
        <div>
          <button
            className="failure-view-retry-btn"
            onClick={this.onClickJobFailureRetryBtn}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobItemDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderJobItemDetails()}
      </>
    )
  }
}

export default JobItemDetails
