import './index.css'

const NotFound = () => {
  return (
    <div className="not-found-bg-container">
      <div className="not-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
          className="not-found-img mb-3"
        />
        <h1 className="page-not-found-text mb-3">Page Not Found</h1>
        <p>We are sorry, the page you requested could not found.</p>
      </div>
    </div>
  )
}

export default NotFound
