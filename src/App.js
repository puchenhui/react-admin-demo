import { React, Component } from 'react'
import { Switch, Route, Redirect, Router } from 'react-router-dom'
import { adminRouters } from './routes'
import Frame from './components/frame'
import SystemLog from "@/pages/systemLog";
import User from "@/pages/user";
import Census from "@/pages/census";
import SystemAuth from "@/pages/systemAuth";

import './App.less'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  generateRouter = (adminRouters) => {
    return (
      adminRouters.map(r => {
        if (r.childrens) {
          return (
            <Route 
            key={r.path} 
            path={r.path} 
            render={routeProps => {
              return (<r.component {...routeProps} />);
            }}>(
              <Switch>
                <Route key={r.path} path={r.path} render={routeProps => {
                  return (<r.component {...this.props} >
                    {this.generateRouter(r.childrens)}
                  </r.component>);
                }}>
                </Route>
              </Switch>
          </Route>
  
          )
          

          // return (
          //   <Switch>
          //     <Route key={r.path} path={r.path} render={routeProps => {
          //       return (<r.childrens {...this.props} >
          //         {this.generateRouter(r.childrens)}
          //       </r.childrens>);
          //     }}>
          //     </Route>
          //   </Switch>
          // )
        } else {
  return (
    // <Route
    //   key={r.path}
    //   path={r.path}
    //   exact
    //   render={routeProps => {
    //     return (<r.component {...routeProps} />);
    //   }}
    // />
    <Route
      key={r.path}
      path={r.path}
      exact
      render={routeProps => {
        return (<r.component {...routeProps} />);
      }}
    />
  )
}

      })
    )
  }

render() {
  return (
    <Frame>
      <Switch>
          <Route path="/index" component={User}/>
          <Route path="/admin" >
            <Switch>
              <Route path="/admin/log" component={SystemLog}/>
              <Route path="/admin/census" exact component={Census}/>
              <Route path="/admin/auth" component={SystemAuth} /> 
            </Switch>
          </Route>
        </Switch>

      {/* <Switch>
        {this.generateRouter(adminRouters)}
      </Switch> */}



      {/* {adminRouters.map(r => {
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
          })} */}

    </Frame>
  );
}
}

export default App;

