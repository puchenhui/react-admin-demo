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
        get('/getUser', {
          userId: 330440,
        })
          .then((res) => {
            if (res && res.length > 1) {
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