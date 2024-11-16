import './index.css'
import Header from '../Header/index'
// import Cookies from 'js-cookie'
// import {Redirect, Link} from 'react-router-dom'

const Home = props => {
  const onClickFindJobsBtn = () => {
    const {history} = props
    history.replace('/jobs')
  }

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content-container">
          <h1 className="home-container-heading mb-4">
            Find The Job That Fits Your Life
          </h1>
          <p className="home-container-desc mb-5">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <div>
          
            <button className="find-jobs-btn" onClick={onClickFindJobsBtn}>
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
