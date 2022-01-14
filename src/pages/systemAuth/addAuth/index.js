import { React, Component, Fragment } from 'react'
import {
  message, Checkbox, Drawer, Form, Input, Row, Col, Button
} from 'antd';
import { get, post } from '@/utils/request';
import CustomTable from '@/components/customTable';

const FormItem = Form.Item;
class AddAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logData: [], //表格数据
      currentPage: 1, //当前页数
      loading: false, // 表格loading状态
      currentTree: [], // 当前选中的树结构
      visible: false, //控制新增人员/岗位是否显示
      addAuthType: null,// 当前选中的新增授权类型 1是人员 2是岗位
    };
  }

  componentDidMount() {
    this.props.onRef(this);    // 调用父组件传入的函数，把自身赋给父组件

  }


  // 打开
  showDrawer = (type) => {
    this.setState({
      visible: true,
      addAuthType: type,
    }, () => {
      this.getLogMsg()
    });
  };

  // 关闭
  onClose = () => {
    this.setState({
      visible: false,
      logData: [],
      currentPage: 1,
      total: null,
    });
  };

  // 点击查询
  queryData = () => {
    const { form } = this.props;
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    form.validateFields((err, fieldsValue) => {
      const { userName } = fieldsValue || {};
      this.setState({
        name: userName
      })
      get('searchCanAuthorize', {
        page: 1,
        size: 10,
        userId: userLoginMsg.id,
        name: userName,
      })
        .then((res) => {
          this.setState({
            logData: res.pageRecode,
            total: res.total,
            loading: false,
          })
        })
        .catch((err) => {
          message.error('网络错误')
          this.setState({
            loading: false,
          })
        })
    })
  }

  // 重置列表
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      name: [],
      currentPage: 1,
    });
    this.getLogMsg();
  }

  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    this.setState({ loading: true })
    const { currentTree } = this.props;
    const { addAuthType } = this.state;
    const children = currentTree.children || [];
    let type;
    if (addAuthType === 1) {
      if (currentTree.type === 2 && children.length === 0) {
        type = 2;
      } else {
        type = 1;
      }
    } else {
      if (currentTree.type === 2 && children.length === 0) {
        type = 4;
      } else {
        type = 3;
      }
    }

    get('getCanAuthorizeObj', {
      page: 1,
      size: 10,
      userId: userLoginMsg.id,
      departmentId: currentTree.key,
      type,
      ...params
    })
      .then((res) => {
        this.setState({
          logData: res.pageRecode,
          total: res.total,
          loading: false,
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
  saveAuth = (record) => {
    const { browseData = {}, manageData = {} } = this.state;

    if (browseData.browse && !manageData.manage) {
      this.submitSaveAuth(record, browseData)
    }
    if (!browseData.browse && manageData.manage) {
      message.error('请再选择浏览权限')
    }
    if (!browseData.browse && !manageData.manage) {
      message.error('请选择授权功能后再提交')
    }
    if (browseData.browse & manageData.manage) {
      let msg = {}
      const datas = Object.assign(msg, browseData, manageData)
      this.submitSaveAuth(record, datas)
    }
  }

  // 提交保存
  submitSaveAuth = (record, data) => {
    const { currentTree } = this.props;
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    if (record.id === data.id) {
      let subData = []
      subData.push(data)
      const {
        id, positionId, name, departmentId, departmentName, unit, path, parentId,
      } = record;
      const { addAuthType } = this.state;
      const dataMsg = {
        operatorId: userLoginMsg.id,
        departmentId: currentTree.key,
        userId: userLoginMsg.id,
        operatorName: userLoginMsg.name,
        authorizeObjectId: id,
        authorizeObjectType: addAuthType,
        authorizeContent: "工作授权",
        browse: data.browse,
        manage: data.manage,
      }
      const userAdd = [{
        ...dataMsg,
        authorizeObjectName: name,
        authorizeObjectPositionId: positionId,
        authorizeObjectDepartmentId: departmentId,
        authorizeObjectPath: unit + '/' + departmentName,
      }];
      const stationAdd = [{
        ...dataMsg,
        authorizeObjectPositionId: id,
        authorizeObjectDepartmentId: parentId,
        authorizeObjectPath: path,
      }]
      post('authorize', {
        authorizes: addAuthType === 1 ? userAdd : stationAdd,
      })
        .then((res) => {
          message.success('授权成功')
          this.getLogMsg()
          if (addAuthType === 1) {
            this.props.getLogMsg()
          }
        })
        .catch((err) => {
          message.error('网络错误')
        })
    } else {
      message.error('请提交选中行')
    }
  }




  render() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      logData, total, currentPage, loading, addAuthType
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
        title: addAuthType === 1 ? '姓名' : '岗位',
        dataIndex: 'name',
        width: 60,
      },
      // {
      //   title: '部门',
      //   dataIndex: 'departmentName',
      //   width: 80,
      // },
      {
        title: '组织路径',
        width: 120,
        render: (text, record) => {
          if (addAuthType === 1) {
            return (
              record.unit + '/' + record.departmentName
            )
          } else {
            return (record.path)
          }

        }
      },
      {
        title: '浏览',
        dataIndex: 'browse',
        width: 30,
        render: (text, record, index) => {
          return (
            <Checkbox
              onChange={this.onBrowseChange}
              id={record.id}
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
              onChange={this.onManageChange}
              id={record.id}
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
    if (addAuthType === 1) {
      columnsMsg.splice(2, 0, {
        title: '部门',
        dataIndex: 'departmentName',
        width: 80,
      })
    }

    const columns = columnsMsg.map(i => { return { ...i, align: 'center' } });

    return (
      <Fragment>
        <Drawer
          title={`新增授权${addAuthType === 1 ? '人员' : '岗位'}`}
          placement="right"
          width={800}
          destroyOnClose={true}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {
            addAuthType === 1 ? (
              <Form layout="inline">
                <Row className="addAuth-gutter-row">
                  <Col className="addAuth-gutter-col gutter-row addAuth-name" span={6} >
                    <FormItem>
                      {getFieldDecorator('userName')(<Input placeholder="请输入授权人姓名" />)}
                    </FormItem>
                  </Col>
                  <Col className="gutter-row addAuth-btn" span={6} style={{ 'marker': '3px 0 0 8px' }}>

                    <Button type="primary" onClick={this.queryData}>
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      重置
                    </Button>
                  </Col>
                </Row>
              </Form>
            ) : null
          }

          <CustomTable
            columns={columns}
            dataSource={logData}
            onChange={this.changePage}
            loading={loading}
            rowKey={record => record.keyId}
            pagination={{
              current: currentPage,
              total: total,
              showTotal: total => `总共 ${total} 条`,
            }}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default Form.create({})(AddAuth);