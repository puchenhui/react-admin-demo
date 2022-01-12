import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './index.css';
import App from './App';
import zhCN from 'antd/es/locale/zh_CN';
import * as serviceWorker from "./serviceWorker";
import { ConfigProvider } from 'antd';
import moment from 'moment';
import Login from "@/pages/login";
import MyRote from '@/utils/myRoute';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css'

moment.locale('zh-cn');
ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Router>
      <Switch >
        <Route path="/" exact render={() => <Redirect to="/login" />} />
        <Route path="/login" component={Login} />
        <MyRote path="/" render={(routeProps) => <App {...routeProps} />} /> {/* 全局登陆状态判断 */}        
      </Switch>
    </Router>
  </ConfigProvider>
  ,
  document.getElementById('root')
);
serviceWorker.unregister();