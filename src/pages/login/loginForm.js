import React from 'react';
import { withRouter } from 'react-router-dom'
import {
    Form, Icon, Input, Button, message,
} from 'antd';
import { post, get } from '../../utils/request';

class LoginForm extends React.Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                get('/getUser',{
                    userId: 999999,
                })
                .then((res) => {
                    window.localStorage.setItem('userLoginMsg',JSON.stringify(res));
                    message.success('登陆成功')
                    this.props.history.push('/admin/index')
                })
                .catch((err)=>{
                    message.error('接口有误')
                })
                
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {
                        getFieldDecorator('userId', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input prefix={
                            <Icon type="user" 
                            style={{ color: 'rgba(0,0,0,.25)' }} />} 
                            placeholder="请输入用户名" />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码!' }],
                        })(
                        <Input prefix={
                        <Icon type="lock" 
                        style={{ color: 'rgba(0,0,0,.25)' }} />} 
                        type="password"
                         placeholder="请输入密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登陆
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default withRouter(Form.create({ name: 'normal_login' })(LoginForm));