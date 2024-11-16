import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class ProfileFilter extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    selectedEmploymentTypes: [],
  }

  componentDidMount() {
    this.getProfile()
  }

  onRadioChange = event => {
    const {changeSalaryRange} = this.props
    const selectedSalaryRangeId = event.target.value
    changeSalaryRange(selectedSalaryRangeId)
  }

  onEmploymentTypeChange = event => {
    const {selectedEmploymentTypes} = this.state
    const {onEmploymentTypeChangeUpdate} = this.props
    const {value} = event.target

    const updatedEmploymentTypes = selectedEmploymentTypes.includes(value)
      ? selectedEmploymentTypes.filter(item => item !== value)
      : [...selectedEmploymentTypes, value]

    this.setState({selectedEmploymentTypes: updatedEmploymentTypes}, () => {
      onEmploymentTypeChangeUpdate(updatedEmploymentTypes)
    })
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const profileData = fetchedData.profile_details
      const updatedProfileData = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: updatedProfileData,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-container mb-2">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-img mb-2"
        />
        <h1 className="profile-name mb-3">{profileDetails.name}</h1>
        <p className="profile-short-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => {
    return (
      <div className="profile-loading-view-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }

  onClickProfileRetryBtn = () => {
    this.getProfile()
  }

  renderProfileFailureView = () => {
    return (
      <div className="profile-failure-container">
        <button
          className="profile-retry-btn"
          onClick={this.onClickProfileRetryBtn}
        >
          Retry
        </button>
      </div>
    )
  }

  renderProfile = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeSalaryRangeId} = this.props
    const {selectedEmploymentTypes} = this.state
    return (
      <div className="profile-filter-container">
        {this.renderProfile()}
        <hr className="hr-line-profile" />
        <div className="employment-type-container mt-2">
          <h1 className="types-of-employment-heading">Type of Employment</h1>
          <ul className="types-of-employment-list-container">
            {employmentTypesList.map(eachEmployment => (
              <li
                key={eachEmployment.employmentTypeId}
                className="employment-type-item-container"
              >
                <input
                  type="checkbox"
                  value={eachEmployment.employmentTypeId}
                  id={eachEmployment.employmentTypeId}
                  className="mr-2"
                  checked={selectedEmploymentTypes.includes(
                    eachEmployment.employmentTypeId,
                  )}
                  onChange={this.onEmploymentTypeChange}
                />
                <label
                  htmlFor={eachEmployment.employmentTypeId}
                  className="checkbox-label ml-1"
                >
                  {eachEmployment.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr className="hr-line-profile mt-0" />
        <div className="salary-range-container mt-2">
          <h1 className="types-of-salary-heading">Salary Range</h1>
          <ul className="types-of-salary-list-container">
            {salaryRangesList.map(eachSalaryRange => (
              <li
                key={eachSalaryRange.salaryRangeId}
                className="salary-type-item-container"
              >
                <input
                  type="radio"
                  name="option"
                  value={eachSalaryRange.salaryRangeId}
                  id={eachSalaryRange.salaryRangeId}
                  className="mr-2"
                  onChange={this.onRadioChange}
                  checked={
                    activeSalaryRangeId === eachSalaryRange.salaryRangeId
                  }
                />
                <label
                  htmlFor={eachSalaryRange.salaryRangeId}
                  className="checkbox-label ml-1"
                >
                  {eachSalaryRange.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default ProfileFilter
