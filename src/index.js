import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './index.css';
import App from './App';
import { mainRouters } from './routes'
import zhCN from 'antd/es/locale/zh_CN';
import * as serviceWorker from "./serviceWorker";
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css'

moment.locale('zh-cn');
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Router>
      <Switch >
        <Route path="/admin" render={(routeProps) => <App {...routeProps} />} />
        {/* <Route path="/" component={Welcome} exact /> */}
        {mainRouters.map((i) => {
          return <Route key={i.path} path={i.path} component={i.component} />;
        })}
        <Redirect to='/login' />
      </Switch>
    </Router>
  </ConfigProvider>
  ,
  document.getElementById('root')
);
serviceWorker.unregister();