import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { adminRouters } from '../../routes';
import { Link, withRouter, Switch, Route } from 'react-router-dom'
import img01 from '../public/img01.png'
import SystemLog from "@/pages/systemLog";
import User from "@/pages/user";
import Census from "@/pages/census";
import SystemAuth from "@/pages/systemAuth";

import './index.less'

const { SubMenu, Item } = Menu;
const { Header, Content, Sider, Footer } = Layout;


class MainIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatusName: null,
      departmentName: null,
      collapsed: false,
    };
  }

  componentDidMount() {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg'))
    const loginStatusName = userLoginMsg ? userLoginMsg.name : {}
    const departmentName = userLoginMsg ? userLoginMsg.departmentName : {}
    this.setState({
      loginStatusName,
      departmentName,
    })
  }

  // 伸缩菜单
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  // 渲染无父级的菜单
  renderMenuItem = ({ path, icon, title, isShow = true }) => {
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
  renderSubMenu = ({ path, icon, title, childrens, isShow = true }) => {
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

  // 展示路由
  showSubRoute = (route) => {
    const aaa = route.map(item => {
      if (item.childrens && item.childrens.length > 0) {
        return this.showSubRoute(item.childrens)
      }
      if (item.component && item.path) {
        return item
      }
        // ? this.showSubRoute(item.childrens)
        // : this.showRoute(item)
    })
    return(
      <Switch>
        {
          aaa.map( i => {
            return(
              <Route key={i.path} path={i.path} component={i.component} />
            )
          })
        }
      </Switch>
    )
  }

  showRoute = (route) => {
    const aa = []
    aa.push(route)
  
      return (
        <Switch>
          <Route key={route.path} path={route.path} component={route.component} />
          {/* {
            if (route.component && route.path) {
              return <Route key={route.path} path={route.path} component={route.component} />
            }
            // route.map( i => {
            //   if (route.component && route.path) {
            //     return <Route key={route.path} path={route.path} component={route.component} />
            //   }
              
            // })
          } */}

        </Switch>
      )
    
  }

    render() {
      const { loginStatusName, departmentName, collapsed } = this.state;

      return (
        <div className='ztj-frame'>
          <Layout>
            <Sider
              style={{
                overflow: 'auto',
                height: '100vh',
                // position: 'fixed',
                // left: 0,
              }}
              trigger={null}
              collapsible
              collapsed={collapsed}
            >
              <div className="logo" />
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/index']}
                defaultOpenKeys={['/admin']}
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
            <Layout>
              <Header className='frame-header'>
                <div className='header-box'>
                  <Icon
                    className="trigger"
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <div>
                    <img src={img01} alt='头像' />
                    {`${departmentName}\xa0\xa0\xa0\xa0${loginStatusName}`}
                  </div>
                </div>
              </Header>
              <Content style={{ margin: '24px 16px 0', overflow: 'initial', }}>
                <div style={{ padding: 24, background: '#fff', textAlign: 'center', }}>
                  {/* {this.props.children} */}
                  {/* <Switch> */}
                  {this.showSubRoute(adminRouters)}

                  {/* {
                adminRouters && adminRouters.map(item => {
                  return item.childrens && item.childrens.length > 0
                    ? this.showSubRoute(item)
                    : this.showRoute(item)
                })
              } */}

                  {/* <Route path="/index" component={User} />
                  <Route path="/admin/log" component={SystemLog} />
                  <Route path="/admin/census" component={Census} />
                  <Route path="/admin/auth" component={SystemAuth} /> */}
                  {/* </Switch> */}
                </div>
              </Content>
            </Layout>

          </Layout>
        </div >
      );
    }
  }

export default withRouter(MainIndex);