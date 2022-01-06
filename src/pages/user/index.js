import { React, Component, Fragment } from 'react'
import { 
  message, Table, Form, Select, Input, Row, Col, Button, DatePicker, Card
} from 'antd';
import { withRouter } from 'react-router-dom'
import { get, post } from '../../utils/request';
import DreeData from '@/components/treeData';
// import './index.less'


class MainIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logData:[],
      currentPage:1,
      loading: false,
    };
    // 将查询方式传给树结构组件，用于选择组织后查询列表数据
    this.getUserData=this.getUserData.bind(this);
  }

  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {}
    this.setState({loading:true})
    const { departmentId } = this.state;
    get('getUserInfo',{
      page:1,
      size:10,
      userId:userLoginMsg.id,
      departmentId,
      positionId:userLoginMsg.positionId,
      ...params
    })
    .then((res)=>{
      this.setState({
        logData: res.pageRecode,
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
    const { formValues} = this.state;
    this.pagination = pagination;
    const params = {
      page: pagination.current,
      size: pagination.pageSize,
      ...formValues,
    };
    this.setState({
      currentPage:pagination.current
    })
    this.getLogMsg(params) 
  };

  download = () => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg'))
    const { formValues } = this.state;
    return message.error('该功能正在完善，马上就好~~~')
    
    post('/getUrl',{
      userId:userLoginMsg.id,
      positionId:userLoginMsg.positionId,
      ...formValues
    })
    .then((res)=>{
      //   window.open(res.url)
    })
    // post('/getUrl')
    // .then((res)=>{
    //   window.open(res.utl)
    // })
  }

  tableTitle = () => {
    return(
      <Button type="primary"  icon="download" onClick={this.download}>
        导出
      </Button>
    )
  }

  // 通过点击部门传值并获取员工信息
  getUserData = (res) => {
    if (res.length > 0) {
      this.setState({
        departmentId:res[0]
      },()=>{
        this.getLogMsg()
      })
    }
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
          <Table
            columns={columns}
            dataSource={logData}
            locale={{ emptyText: '暂无数据' }}
            bordered
            rowKey={record => record.id}
            onChange={this.changePage}
            loading={loading}
            title ={this.tableTitle}
            pagination={{
              showSizeChanger:true,
              defaultCurrent:1,
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