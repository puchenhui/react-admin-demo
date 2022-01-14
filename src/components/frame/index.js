import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { adminRouters } from '../../routes';
import { Link, withRouter } from 'react-router-dom'
import img01 from '../public/img01.png'
import './index.css'

const { SubMenu, Item } = Menu;
const { Header, Content, Sider, Footer } = Layout;


class MainIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatusName:null,
      departmentName:null,
    };
  }

  componentDidMount(){
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg'))
    const loginStatusName = userLoginMsg ? userLoginMsg.name : {}
    const departmentName = userLoginMsg ? userLoginMsg.departmentName : {}
    this.setState({
      loginStatusName,
      departmentName,
    })
  }

 
  // 渲染无父级的菜单
  renderMenuItem = ({ path, icon, title, isShow=true }) => {
    if (isShow === true) {
      return (
        <Item key={path}>
          <Link to={path}>
            {icon && <Icon type={icon} />}
            <span>{title}</span>
          </Link>
        </Item>
      )
    }
  }
  // 渲染带父级的菜单
  renderSubMenu = ({ path, icon, title, childrens, isShow=true }) => {;
    if (isShow === true) {
      return (
        <SubMenu key={path} title={<span>{icon && <Icon type={icon} />}<span>{title}</span></span>}>
          {
            childrens && childrens.map(item => {
              return item.childrens && item.childrens.length > 0 
              ? this.renderSubMenu(item) 
              : this.renderMenuItem(item)
            })
          }
        </SubMenu>
      )
    }
  }
  render() {
    const { loginStatusName,departmentName } = this.state;
    return (
      <div className='ztj-frame'>
        <Layout>
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
            <div className="logo" />
            <Menu
              theme="dark" 
              mode="inline"
              defaultSelectedKeys={['/index']}
              defaultOpenKeys	={['/admin']}
              selectedKeys={[this.props.location.pathname]}
            >
              {
                adminRouters && adminRouters.map(item => {
                  return item.childrens && item.childrens.length > 0 
                  ? this.renderSubMenu(item) 
                  : this.renderMenuItem(item)
                })
              }
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header className='frame-header'>
              <img src={img01} alt='头像'/>
              {`${departmentName}\xa0\xa0\xa0\xa0${loginStatusName}`}
            </Header>
            <Content style={{ margin: '24px 16px 0', overflow: 'initial', }}>
              <div style={{ padding: 24, background: '#fff', textAlign: 'center', }}>

                {this.props.children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default withRouter(MainIndex);