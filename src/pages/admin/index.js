import { React, Component, Fragment } from 'react'
import { 
  message, Table, Form, Select, Input, Row, Col, Button, DatePicker, Tag,
} from 'antd';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import { get, post } from '../../utils/request';


const FormItem = Form.Item;
const SelectOption = Select.Option;
const { TextArea } = Input;
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;
const columnsMsg = [
  {
    title: '操作人',
    dataIndex: 'userName',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
  },
  {
    title: '功能模块',
    dataIndex: 'model',
  },
  {
    title: '操作类型',
    dataIndex: 'description',
  },
  {
    title: '接口',
    dataIndex: 'url',
  },
  {
    title: '方法名',
    dataIndex: 'method',
  },
  {
    title: '操作结果',
    dataIndex: 'result',
    render:(text)=>{
      if (text==='Success') {
        return(<Tag color="green">成功</Tag>)
      }
      return(<Tag color="red">失败</Tag>)
    }
  },
];

const columns = columnsMsg.map(i => {return {...i,align:'center'}});

class MainIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logData:[],
      currentPage:1,
      loading: false,
    };
  }

  componentDidMount() {
    // 判断登录状态
    const userLoginMsg = window.localStorage.getItem('userLoginMsg');
    if (!userLoginMsg) {
      message.error('请重新登录')
      this.props.history.push('/login')
      return
    }

    this.getLogMsg()
  }

  /**禁止选当前日期之后的时间 */
  disabledDate = (current)=> {
    return current && current >= moment().endOf('day');
  }

  // 请求列表数据
  getLogMsg = (params) => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg'))
    this.setState({loading:true})
    post('log/search',{
      page:1,
      size:10,
      userId:userLoginMsg.id,
      power: userLoginMsg.power,
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
          const values = {
            userName: fieldsValue.userName,
            startTime:fieldsValue.time === null || fieldsValue.time.length === 0 || fieldsValue.time ===  '' ||fieldsValue.time ===  undefined ? undefined : moment(fieldsValue.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime:fieldsValue.time === null || fieldsValue.time.length === 0 || fieldsValue.time === '' || fieldsValue.time ===  undefined ? undefined : moment(fieldsValue.time[1]).format('YYYY-MM-DD HH:mm:ss'),
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

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { logData,total,currentPage,loading, } = this.state;
    return (
      <Fragment>
        <Form layout="inline">
          <Row gutter={[16, 16]}>
            <Col className="gutter-row" xl={6} xxl={6} lg={6}>
              <FormItem label="操作人" >
                {getFieldDecorator('userName')(<Input placeholder="请输入操作人" autocomplete="off" />)}
              </FormItem>
            </Col>
            <Col className="gutter-row" xl={10} xxl={10} lg={10}>
              <FormItem label="操作时间">
                {getFieldDecorator('time')(
                  <RangePicker
                    disabledDate={this.disabledDate}
                  />
                )}
              </FormItem>
            </Col>
            <Col className="gutter-row" xl={8} xxl={8} lg={8} push={1}>
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
        <Table
          columns={columns}
          dataSource={logData}
          locale={{ emptyText: '暂无数据' }}
          bordered
          rowKey={record => record.id}
          onChange={this.changePage}
          loading={loading}
          pagination={{
            showSizeChanger:true,
            defaultCurrent:1,
            current:currentPage,
            showTotal:total => `总共 ${total} 条`,
            total,
          }}
        />
      </Fragment>
    );
  }
}

export default withRouter(Form.create({})(MainIndex));