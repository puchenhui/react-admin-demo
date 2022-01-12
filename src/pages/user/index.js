import { React, Component, Fragment } from 'react'
import { 
  message, Table, Form, Row, Col, Button,
} from 'antd';
import { withRouter } from 'react-router-dom'
import { get, post } from '@/utils/request';
import DreeData from '@/components/treeData';
import { downloadFile } from '@/utils/exportFile';
import CustomTable from '@/components/customTable';


// import './index.less'


class MainIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logData:[],
      currentPage:1,
      loading: false,
      currentTree:[]
    };
    // 将查询方式传给树结构组件，用于选择组织后查询列表数据
    this.getUserData=this.getUserData.bind(this);
  }

  componentDidMount() {
    
  }
  

  // 对返回数据根据order排序
  dataSortup = (x,y) =>{
    return x.order-y.order
  }

  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    this.setState({loading:true})
    const { currentTree } = this.state;
    const children = currentTree.children || [];
    let type;
    if (currentTree.type === 2 && children.length === 0) {
      type = 2;
    } else {
      type = 1;
    }
    get('getUserInfo',{
      page:1,
      size:10,
      userId:userLoginMsg.id,
      departmentId:currentTree.key,
      type,
      positionId:userLoginMsg.positionId,
      ...params
    })
    .then((res)=>{
      this.setState({
        logData: res.pageRecode.sort(this.dataSortup),
        total: res.total,
        loading:false,
      })
    })
    .catch((err) => {
      message.error('网络错误')
      this.setState({
        loading:false,
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
      currentPage:pagination.current
    })
    this.getLogMsg(params) 
  };
  // 下载文件
  download = () => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    const { currentTree } = this.state;
    const children = currentTree.children || [];
    let data = {};
    if (currentTree.type === 2 && children.length === 0) {
      data.type = 5;
    } else {
      data.type = 6;
      data.userId = userLoginMsg.id;
    }
    downloadFile(data,currentTree.key,'部门人员信息表')
  }
  // 导出
  tableTitle = () => {
    return(
      <Button type="primary"  icon="download" onClick={this.download}>
        导出
      </Button>
    )
  }

  // 通过点击部门传值并获取员工信息
  getUserData = (currentTree) => {
    this.setState({
      currentTree:currentTree,
    },()=>{
      this.getLogMsg()
    })
 }

  render() {
    const { logData,total,currentPage,loading, } = this.state;
    const columnsMsg = [
      {
        title: '序号',
        render:(text,record,index)=>{
          return((currentPage -1)*10 + index+1)
        },
        width:10,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        width:60,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width:120,
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        width:120,
      },
      {
        title: '岗位',
        dataIndex: 'positionName',
        width:60,
      },
    ];
    const columns = columnsMsg.map(i => {return {...i,align:'center'}});

    return (
      <Fragment>
        <Row  gutter={[16, 16]}>
          <Col span={6}  style={{textAlign:'left'}}>
              <DreeData getUserDataFun={this.getUserData} />
          </Col>
          <Col span={18}>
          
          <CustomTable
            columns={columns}
            dataSource={logData}
            onChange={this.changePage}
            loading={loading}
            title ={this.tableTitle}
            rowKey={record => record.keyId}
            pagination={{
              current:currentPage,
              total:total,
              showTotal:total => `总共 ${total} 条`,
            }}
          />
          </Col>
        </Row>
        
      </Fragment>
    );
  }
}

export default withRouter(Form.create({})(MainIndex));