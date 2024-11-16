import './App.css'
import {Route, Switch} from 'react-router-dom'
import LoginForm from './components/Login/index'
import Home from './components/Home/index'
import ProtectedRoute from './components/ProtectedRoute/index'
import Jobs from './components/Jobs/index'
import JobItemDetails from './components/JobItemDetails/index'
import NotFound from './components/NotFound/index'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <NotFound />
  </Switch>
)

export default App
