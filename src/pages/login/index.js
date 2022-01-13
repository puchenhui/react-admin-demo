import React from 'react';
import { Layout } from 'antd'
import LoginForm from './loginForm';
import { withRouter } from 'react-router-dom'
import qs from 'qs';
import { Card,message } from 'antd';
import { get } from '../../utils/request';


class Login extends React.Component{

    componentDidMount() {
        // 单点登录
        const msg = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });

        if (msg && msg.userId) {
          get('/getUser', {
            // userId: 330440,
            userId: msg.userId,
          })
            .then((res) => {
              if (res && res.length > 0) {
                /**
                 * 判断返回的list中 mainPosition（主） 是否为true
                 * 如果是true 获取为true中的数据
                 * 如果是false 获取数据中第一条
                 */
                const msd = res.filter(e => e.mainPosition)
                let data = null;
                if (msd.length > 0) {
                  data = msd[0];
                } else {
                  data = res[0];
                }
  
                window.localStorage.setItem('userLoginMsg',JSON.stringify(data));
                message.success('登陆成功')
                this.props.history.push('/index')
              }
            })
        } else {
          window.location.href="https://g1openid.crcc.cn/oauth/authorize?response_type=code&client_id=fsopn&scope=openid+profile&redirect_uri=http://47.93.126.193:8088/com/fsopn/ipaas/sso/callback"
        }
        // 判断登录状态 如果登陆直接进首页
        const userLoginMsg = window.localStorage.getItem('userLoginMsg');
        if (userLoginMsg) {
            this.props.history.push('/index')
        }
      }
    render(){
        return (
            <Layout 
                style={{ 
                    textAlign:'center' ,
                    backgroundImage:'url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg)',
                    height:'100vh'
                }}
            >
                {/* <Card
                    style={{ width:300,height:270,position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)' }}
                >
                    <h1>登录页</h1>
                    <LoginForm />
                </Card> */}
               
               <h1 style={{ position:'absolute', left:'50%', top:'50%', fontSize:'15px' }}> 欢迎您进入Hr系统</h1>
            </Layout>
        )
    }
}

export default withRouter(Login);



