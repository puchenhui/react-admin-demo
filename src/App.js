import {React,Component} from 'react'
import { Switch,Route,Redirect } from 'react-router-dom'
import { adminRouters } from './routes'
import Frame from './components/frame'
import './App.less'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  generateRouter = (adminRouters) => {
    adminRouters.map(r => {
      if (r.childrens) {
        return(this.generateRouter(r.childrens))
      }
      return(
        <Route
          key={r.path}
          path={r.path}
          exact={r.exact}
          render={routeProps => {
            return (<r.component {...routeProps} />);
          }
        }>
          {r.component}
          </Route>
      )
    })
  }
  
  render() {
    return (
      <Frame>
        <Switch>
        
         {/* { this.generateRouter(adminRouters)} */}
        {adminRouters.map(r => {
            return (
              <Route
                key={r.path}
                path={r.path}
                exact={r.exact}
                render={routeProps => {
                  return (<r.component {...routeProps} />);
                }}
              />
            );
          })}
          <Redirect to='/404' />
        </Switch>
      </Frame>
    );
  }
}

export default App;

