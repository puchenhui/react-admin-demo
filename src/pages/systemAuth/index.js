import { React, Component, Fragment } from 'react'
import {
  message, Row, Col, Button, Checkbox, Form, Input,
} from 'antd';
import { withRouter } from 'react-router-dom'
import { get, post } from '@/utils/request';
import DreeData from '@/components/treeData';
import { downloadFile } from '@/utils/exportFile';
import CustomTable from '@/components/customTable';
import AddAuth from './addAuth';
import './index.less'

const FormItem = Form.Item;
class MainIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logData: [],
      currentPage: 1,
      loading: false,
      currentTree: [],
      checkDisabled: false,
    };
    // 将查询方式传给树结构组件，用于选择组织后查询列表数据
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {

  }




  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    this.setState({ loading: true })
    const { currentTree } = this.state;
    const children = currentTree.children || [];
    let type;
    if (currentTree.type === 2 && children.length === 0) {
      type = 2;
    } else {
      type = 1;
    }
    get('getAuthorizeList', {
      page: 1,
      size: 10,
      operatorId: userLoginMsg.id,
      orgId: currentTree.key,
      type,
      ...params
    })
      .then((res) => {
        this.setState({
          logData: res.pageRecode,
          total: res.total,
          loading: false,
          checkDisabled: res.pageRecode ? !res.pageRecode[0].browse : false,
        })
      })
      .catch((err) => {
        message.error('网络错误')
        this.setState({
          loading: false,
        })
      })
  }
  // 切换分页时回调
  changePage = (pagination, filtersArg, sorter) => {
    this.pagination = pagination;
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
    };
    this.setState({
      currentPage: pagination.current
    })
    this.getLogMsg(params)
  };


  // 通过点击部门传值并获取员工信息
  getUserData = (currentTree) => {
    this.setState({
      currentTree: currentTree,
    }, () => {
      this.getLogMsg()
    })
  }

  // 打开侧边栏
  opanAdd = (type) => {
    const { currentTree } = this.state;
    if (currentTree.length === 0) {
      return message.error('请先选择组织后再进行授权')
    }
    this.child.showDrawer(type);
    this.setState({
      visible: true,
    });
  };

  // 浏览复选框变化
  onBrowseChange = (e) => {
    const data = {
      id: e.target.id,
      browse: e.target.checked,
    }
    this.setState({
      browseData: data
    })
  }
  // 管理复选框变化
  onManageChange = (e) => {
    const data = {
      id: e.target.id,
      manage: e.target.checked,
    }
    this.setState({
      manageData: data
    })
  }

  /**
   * saveAuth 点击保存按钮  browse 浏览  manage 管理
   *当2个都选了或者只选了浏览可以提交
   *当只选了管理时不能提交 提示 还要选浏览
   *当2个都没选时不能提交
   * @param {*} record 当前选中所有数据
   */
  saveAuth = (record) => {
    const { browseData = {}, manageData = {} } = this.state;

    if (record.browse && record.manage) {
      if (!browseData.id && !manageData.id) {
        return message.success('授权成功')
      }
      if (!browseData.id && manageData.id) {
        const msg = {
          id: manageData.id,
          manage: manageData.manage,
          browse: record.browse,
        }
        return this.submitSaveAuth(record, msg)
      }
      if (!browseData.browse && !manageData.manage) {
        return message.error('请授权权限')
      }
      if (browseData.browse && !manageData.manage) {
        return this.submitSaveAuth(record, browseData)
      }
      if (browseData.browse & manageData.manage) {
        let msg = {}
        const datas = Object.assign(msg, browseData, manageData)
        return this.submitSaveAuth(record, datas)
      }
      if ((!browseData.browse && manageData.manage)) {
        return message.error('请再选择浏览权限')
      }
    }


    if (record.browse && !record.manage) {
      if (!browseData.id && !manageData.id) {
        return message.success('授权成功')
      }
      if (!browseData.id && manageData.id) {
        const msg = {
          id: manageData.id,
          manage: manageData.manage,
          browse: record.browse,
        }
        return this.submitSaveAuth(record, msg)
      }
      if (!browseData.browse && !manageData.manage) {
        return message.error('请授权权限')
      }
      if (browseData.browse && !manageData.manage) {
        return this.submitSaveAuth(record, browseData)
      }
      if (browseData.browse & manageData.manage) {
        let msg = {}
        const datas = Object.assign(msg, browseData, manageData)
        return this.submitSaveAuth(record, datas)
      }
      if ((!browseData.browse && manageData.manage)) {
        return message.error('请再选择浏览权限')
      }
    }

  }

  submitSaveAuth = (record, data) => {
    if (record.id === data.id) {

      const {
         id,authorizeObjectPositionId, authorizeObjectName, authorizeObjectDepartmentId, authorizeObjectPath, authorizeObjectType,authorizeObjectId
      } = record;
      const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
      post('authorize', {
        authorizes: [{
          id:id,
          operatorId: userLoginMsg.id,
          operatorName: userLoginMsg.name,
          authorizeObjectId,
          authorizeObjectType,
          authorizeContent: "工作授权",
          browse: data.browse,
          manage: data.manage,
          authorizeObjectName,
          authorizeObjectPositionId,
          authorizeObjectDepartmentId,
          authorizeObjectPath,
        }],
      })
        .then((res) => {
          message.success('授权成功')
          this.getLogMsg()
        })
        .catch((err) => {
          message.error('网络错误')
        })
    } else {
      message.error('请提交选中行')
    }
  }

  tableTitle = () => {
    return (
      <div>
        <Button type="primary" style={{'marginRight':'15px'}} onClick={() => this.opanAdd(1)}>
          新增授权人员
        </Button>
        <Button type="primary" onClick={() => this.opanAdd(2)}>
          新增授权岗位
        </Button>
      </div>
    )
  }


  render() {
    const {
      logData, total, currentPage, loading, visible, currentTree,
      checkDisabled
    } = this.state;
    const columnsMsg = [
      {
        title: '序号',
        render: (text, record, index) => {
          return ((currentPage - 1) * 10 + index + 1)
        },
        width: 30,
      },
      {
        title: '授权人姓名',
        dataIndex: 'authorizeObjectName',
        width: 60,
      },
      {
        title: '授权部门',
        dataIndex: 'authorizeObjectPath',
        width: 120,
      },
      {
        title: '授权方式',
        dataIndex: 'authorizeObjectType',
        width: 60,
        render: (text) => {
          return (text === 1 ? '新增人员授权' : '新增岗位授权')
        }
      },
      {
        title: '浏览',
        dataIndex: 'browse',
        width: 30,
        render: (text, record, index) => {
          return (
            <Checkbox
              defaultChecked={text}
              onChange={this.onBrowseChange}
              id={record.id}
              disabled={checkDisabled}
            // checked={record.browse}
            />
          )
        },
      },
      {
        title: '管理',
        dataIndex: 'manage',
        width: 30,
        render: (text, record, index) => {
          return (
            <Checkbox
              defaultChecked={text}
              onChange={this.onManageChange}
              id={record.id}
              disabled={checkDisabled}
            // checked={record.manage}
            />
          )
        },
      },
      {
        title: '操作',
        width: 30,
        render: (text, record) => {
          return (
            <a onClick={() => this.saveAuth(record)}>授权</a>
          )
        },
      },
    ];
    const columns = columnsMsg.map(i => { return { ...i, align: 'center' } });


    return (
      <Fragment>
        <Row gutter={[16, 16]}>
          <Col span={6} style={{ textAlign: 'left' }}>
            <DreeData getUserDataFun={this.getUserData} />
          </Col>
          <Col span={18} style={{ 'marginTop': '-3px' }}>
            <CustomTable
              columns={columns}
              dataSource={logData}
              onChange={this.changePage}
              loading={loading}
              title={this.tableTitle}
              // rowKey={record => record.id}
              pagination={{
                current: currentPage,
                total: total,
                showTotal: total => `总共 ${total} 条`,
              }}
            />
          </Col>
        </Row>
        <AddAuth
          visible={visible}
          currentTree={currentTree}
          onRef={(ref) => { this.child = ref }}
          getLogMsg={this.getLogMsg}
        />
      </Fragment>
    );
  }
}

export default withRouter(Form.create({})(MainIndex));