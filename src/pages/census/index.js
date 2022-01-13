import { React, Component, Fragment } from 'react'
import {
  message, Row, Col,Tabs,
} from 'antd';
import { withRouter } from 'react-router-dom'
import { get, post } from '@/utils/request';
import DreeData from '@/components/treeData';
import CustomTable from '@/components/customTable';

const { TabPane } = Tabs;

class Census extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logData: [],
      currentPage: 1,
      loading: false,
      total:null,
      currenTab:1,
    };
    // 将查询方式传给树结构组件，用于选择组织后查询列表数据
    this.getUserData = this.getUserData.bind(this);
  }

  // 对返回数据根据order排序
  dataSortup = (x, y) => {
    return x.order - y.order
  }

  // 切换标签
  changeTabs = (key) => {
    const type = parseInt(key)
    const { currentTree } = this.state;
    
    this.setState({
      page:1,
      currentPage:1,
      logData:[],
      total:null,
      currenTab: type,
    },() =>{
      if (!currentTree) {
        return message.error('请先选择组织')
      }
      this.getLogMsg()
    })
    
  };

  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    this.setState({ loading: true })
    const { currentTree,currenTab } = this.state;
    const children = currentTree.children || [];
    let type;
    if (currentTree.type === 2 && children.length === 0) {
      type = 2;
    } else {
      type = 1;
    }
    let url;
    if (currenTab === 1) {
      url = 'jobChange';
    } 
    if (currenTab === 2) {
      url = 'invalidPost';
    }
    if (currenTab === 3) {
      url = 'getUserInfo';
    }
    get(url, {
      page: 1,
      size: 10,
      userId: userLoginMsg.id,
      departmentId: currentTree.key,
      type,
      positionId: userLoginMsg.positionId,
      ...params
    })
      .then((res) => {
        this.setState({
          logData: res.pageRecode.sort(this.dataSortup),
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

  // 切换表格分页时回调
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
    const { currenTab } = this.state;
    this.setState({
      currentTree: currentTree,
    },() => {
      this.getLogMsg()
    })
   
    
  }
  // 标签里的表格
  tableTabs = () => {
    const { logData, total, currentPage, loading,currenTab } = this.state;

    const columnsMsg = [
      {
        title: '序号',
        render: (text, record, index) => {
          return ((currentPage - 1) * 10 + index + 1)
        },
        width: 30,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width: 30,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 120,
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        width: 30,
      },
      {
        title: '岗位',
        dataIndex: 'positionName',
        width: 30,
      },
    ];
    if (currenTab === 1) {
      columnsMsg.push({
        title: '历史岗位',
        dataIndex: 'oldPositionName',
        width: 30,
      })
    }
    const columns = columnsMsg.map(i => { return { ...i, align: 'center' } });
    return (
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
    )
  }

  render() {
    return (
      <Fragment>
        <Row gutter={[16, 16]}>
          <Col span={6} style={{ textAlign: 'left' }}>
            <DreeData getUserDataFun={this.getUserData} />
          </Col>
          <Col span={18}>
            <Tabs defaultActiveKey="1" onChange={this.changeTabs}>
              <TabPane tab="被授权人职称变化" key="1">
                {this.tableTabs()}
              </TabPane>
              <TabPane tab="失效授权人员岗位" key="2">
                {this.tableTabs()}
              </TabPane>
              <TabPane tab="授权人统计" key="3">
                {this.tableTabs()}
              </TabPane>
            </Tabs>

          </Col>
        </Row>

      </Fragment>
    );
  }
}

export default withRouter(Census);