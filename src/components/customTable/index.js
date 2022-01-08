import React from 'react'
import { Table } from 'antd';
import './index.less'



class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  
  render() {
    const { 
      columns,dataSource,loading,onChange,pagination,title,rowKey
    } = this.props;
    return (
      <Table 
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        onChange={onChange}
        title={title}
        locale={{ emptyText: '暂无数据' }}
        bordered
        rowKey={rowKey ? rowKey : record => record.id}
        size="middle"
        rowClassName={(record, index) => {
          let className = 'table-light-row';
          if (index % 2 === 1) className = 'table-dark-row';
          return className;
        }}
        pagination={{
          showSizeChanger:true,
          defaultCurrent:1,
          showQuickJumper:true,
          ...pagination,
        }}
      />
    );
  }
}

export default CustomTable;