import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Dashboard from './components/Dashboard'
import LogIn from './components/LogIn'
import Manager from './components/Manager'
import Promotion from './components/Promotion'
import Selectdate from './components/upload/Selectdate'
import UploadSlrip from './components/upload/UploadSlrip'
import HomeUpload from './components/upload/HomeUpload'
import Result from './components/Result'
import ResultHistory from './components/ResultHistory'
import UploadResult from './components/upload/UploadResult'
import PositionMark from './components/position/PositionMark'
import { AuthProvider } from './components/Auth'
import Booking from './components/Booking'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/result/:room" children={<Result/>} />
          <Route path="/resulthistory/:room" children={<ResultHistory/>} />
          <Route path="/room/:room" children={<HomeUpload/>} />
          <Route path="/date/:room&:id" children={<Selectdate/>} />
          <Route path="/slrip/:room&:id" children={<UploadSlrip/>} />
          <Route path="/upresult/:room" children={<UploadResult/>} />
          <Route exact path="/position" component={PositionMark} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/login" component={LogIn} />
          <Route exact path="/manager" component={Manager} />
          <Route exact path="/promotion" component={Promotion} />
          <Route exact path="/booking" component={Booking} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;