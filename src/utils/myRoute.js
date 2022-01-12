import React, { Component } from 'react'
import {Redirect,Route} from "react-router-dom"
/**
 *
 *
 * @export
 * @class MyRote 全局登陆状态判断
 * @extends {Component}
 */
export default class MyRote extends Component {
  
    render() {
      const userLoginMsg = window.localStorage.getItem('userLoginMsg');
        return (
            <div>
                {
                   userLoginMsg ? <Route {...this.props}></Route>:<Redirect to="/login"></Redirect>
                }
            </div>
        )
    }
}