import { React, Component, Fragment } from 'react'
import { 
  message, Table, Form, Select, Input, Row, Col, Button, DatePicker, Card
} from 'antd';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import { get, post } from '@/utils/request';
import DreeData from '@/components/treeData';
import './index.less'
import { downloadFile } from '@/utils/exportFile';
import CustomTable from '@/components/customTable';


const FormItem = Form.Item;
const SelectOption = Select.Option;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;


class MainIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      currentPage:1,
      loading: false,
    };
    // 将查询方式传给树结构组件，用于选择组织后查询列表数据
    this.getUserData=this.getUserData.bind(this);
  }

  componentDidMount() {
    // 判断登录状态
    const userLoginMsg = window.localStorage.getItem('userLoginMsg');
    if (!userLoginMsg) {
      message.error('请重新登录')
      this.props.history.push('/login')
      return
    }
  }

  /**禁止选当前日期之后的时间 */
  disabledDate = (current)=> {
    return current && current >= moment().endOf('day');
  }

  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {};
    const { departmentId,formValues } = this.state;

    if (!departmentId) {
      return message.error('请先选择组织')
    }
    this.setState({loading:true})
    post('log/search',{
      page:1,
      size:10,
      userId:userLoginMsg.id,
      // power: userLoginMsg.power,
      departmentId,
      positionId:userLoginMsg.positionId,
      ...params
    })
    .then((res)=>{
      this.setState({
        dataSource: res.pageRecode,
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

  // 重置
  handleFormReset = () => {
    const { form} = this.props;
    form.resetFields();
    this.setState({
      formValues: [],
      currentPage:1,
    });
    this.getLogMsg();
  };
  // 点击查询
  queryData = () => {
    const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
          const { time, userName } = fieldsValue || {};
          const values = {
            userName: userName === '' ? undefined : userName,
            startTime:time === null || (time && time.length === 0) || time ===  '' || time ===  undefined ? undefined : moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime:time === null || (time && time.length === 0) || time === '' || time ===  undefined ? undefined : moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
          }; 
           this.setState({
              formValues : values
           })
           this.getLogMsg(values)
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
    /*
    * 1：导出所在部门人的全部操作日志  传type= 1 
    * 2：按操作人名字导出日志 传type= 2  userName 
    * 3：按操作时间段导出日志 传type= 3 startTime endTime
    * 4：按操作人操作的时间段导出日志 传type= 4  userName startTime endTime
    * */
    const { formValues, departmentId } = this.state;
    const { userName, startTime, endTime } = formValues || {};

    let data = {}
    if (!formValues || formValues.length === 0 || userName === undefined  || startTime === undefined) {
       data.type=1;
    }
    if (formValues) {
      if (userName && startTime === undefined ) {
        data.type=2;
        data.userName= userName;
      }
      if (startTime && !userName) {
        data.type=3;
        data.startTime= startTime;
        data.endTime= endTime;
      }
      if (startTime && userName) {
        data.type=4;
        data.userName= userName;
        data.startTime= startTime;
        data.endTime= endTime;
      }
    }
    downloadFile(data,departmentId,'操作日志详情表')
  }
  tableTitle = () => {
    return(
      <Button type="primary"  icon="download" onClick={this.download}>
      导出
    </Button>
     
    )
  }

  // 通过点击部门传值并获取日志列表
  getUserData = (res) => {
     this.setState({
      departmentId:res[0]
    },()=>{
      this.getLogMsg()
    })
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { dataSource, total, currentPage, loading, } = this.state;
    const columnsMsg = [
      {
        title: '序号',
        render:(text,record,index)=>{
          return((currentPage -1)*10 + index+1)
        },
        width:10,
      },
      {
        title: '操作人',
        dataIndex: 'userName',
        width:80,
      },
      {
        title: '操作时间',
        dataIndex: 'operationTime',
        width:80,
      },
      {
        title: '操作内容',
        dataIndex: 'content',
        width:80,
      },
      {
        title: '被授权对象路径',
        dataIndex: 'department',
        width:150,
      }
    ];
    const columns = columnsMsg.map(i => {return {...i,align:'center'}});

    return (
      <Fragment>
        <Row  gutter={[16, 16]}>
          <Col span={6}  style={{textAlign:'left'}}>
              <DreeData getUserDataFun={this.getUserData} />
          </Col>
          <Col span={18}>
            <Form layout="inline">
            <Row >
              <Col className="gutter-row" span={7} style={{ textAlign:'left'}}>
                <FormItem label="操作人" >
                  {getFieldDecorator('userName')(<Input placeholder="请输入操作人" />)}
                </FormItem>
              </Col>
              <Col className="gutter-row" span={12} style={{ textAlign:'left'}}>
                <FormItem label="操作时间">
                  {getFieldDecorator('time')(
                    <RangePicker
                      disabledDate={this.disabledDate}
                    />
                  )}
                </FormItem>
              </Col>
              <Col className="gutter-row" span={4} >
                <span>
                  <Button type="primary" onClick={this.queryData}>
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>
          <CustomTable
            columns={columns}
            dataSource={dataSource}
            onChange={this.changePage}
            loading={loading}
            title ={this.tableTitle}
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