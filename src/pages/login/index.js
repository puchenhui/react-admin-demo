import React from 'react';
import { Layout } from 'antd'
import LoginForm from './loginForm';
import { Card } from 'antd';

class Login extends React.Component{

    render(){
        return (
            <Layout 
                style={{ 
                    textAlign:'center' ,
                    backgroundImage:'url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg)',
                    height:'100vh'
                }}
            >
                <Card
                    style={{ width:300,height:270,position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)' }}
                >
                    <h1>登录页</h1>
                    <LoginForm />
                </Card>
            </Layout>
        )
    }
}

export default Login;



