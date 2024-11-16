import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

import Header from '../Header/index'
import ProfileFilter from '../ProfileFilter/index'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsDataList: [],
    activeEmploymentType: '',
    searchJobInput: '',
    activeSalaryRangeId: '',
  }

  changeSalaryRange = selectedSalaryRangeId => {
    this.setState(
      {activeSalaryRangeId: selectedSalaryRangeId},
      this.getJobsList,
    )
  }

  onEmploymentTypeChangeUpdate = selectedEmploymentTypes => {
    const employmentTypeString = selectedEmploymentTypes.join(',')
    this.setState(
      {activeEmploymentType: employmentTypeString},
      this.getJobsList,
    )
  }

  onClickJobFailureRetryBtn = () => {
    this.getJobsList()
  }

  componentDidMount() {
    this.getJobsList()
  }

  getJobsList = async () => {
    const {searchJobInput, activeEmploymentType, activeSalaryRangeId} =
      this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeSalaryRangeId}&search=${searchJobInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const jobsData = fetchedData.jobs
      const updatedJobsData = jobsData.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        title: eachJob.title,
        rating: eachJob.rating,
        location: eachJob.location,
        employmentType: eachJob.employment_type,
        packagePerAnnum: eachJob.package_per_annum,
        jobDesc: eachJob.job_description,
      }))

      this.setState({
        jobsDataList: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsListSuccessView = () => {
    const {jobsDataList} = this.state
    // const jobsDataListSlice = jobsDataList.slice(0, 2)

    return jobsDataList.length > 0 ? (
      <ul className="jobs-list-container mt-5">
        {jobsDataList.map(eachJob => (
          <Link to={`/jobs/${eachJob.id}`} className="job-nav-link">
            <li key={eachJob.id} className="job-item-container mb-4">
              <div className="job-logo-title-rating-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div className="job-title-rating-container ml-3">
                  <h1 className="job-card-title mb-2">{eachJob.title}</h1>
                  <div className="rating-container">
                    <FaStar className="star-icon" style={{color: '#fbbf24'}} />
                    <p className="rating ml-1">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="job-location-type-package-range-container mt-2">
                <div className="job-location-job-type-container">
                  <div className="job-location-container mr-4">
                    <MdLocationOn className="work-location-icon mr-2" />
                    <p>{eachJob.location}</p>
                  </div>
                  <div className="job-type-container">
                    <MdWork className="work-location-icon mr-2" />
                    <p>{eachJob.employmentType}</p>
                  </div>
                </div>
                <p className="package">{eachJob.packagePerAnnum}</p>
              </div>
              <hr className="job-card-hr-line" />
              <h1 className="job-card-desc-heading">Description</h1>
              <p className="job-card-desc">{eachJob.jobDesc}</p>
            </li>
          </Link>
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-img mb-4"
        />
        <h1 className="no-jobs-found-text">No Jobs Found</h1>
        <p className="job-desc">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchJobInput: event.target.value})
  }

  onClickSearchIcon = () => {
    this.getJobsList()
  }

  renderSearchInputContainer = () => {
    const {searchJobInput} = this.state
    return (
      <div className="job-search-input-container">
        <input
          type="search"
          value={searchJobInput}
          className="search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.onClickSearchIcon}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderLoadingView = () => {
    return (
      <div className="jobs-loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  renderJobsListFailureView = () => {
    return (
      <div className="jobs-failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
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

  renderJobsListContainer = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsListFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    const {activeSalaryRangeId} = this.state
    return (
      <>
        <Header />
        <div className="jobs-main-container">
          <ProfileFilter
            changeSalaryRange={this.changeSalaryRange}
            activeSalaryRangeId={activeSalaryRangeId}
            onEmploymentTypeChangeUpdate={this.onEmploymentTypeChangeUpdate}
          />
          <div className="jobs-section-container">
            {this.renderSearchInputContainer()}
            {this.renderJobsListContainer()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
