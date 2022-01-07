import React, { Component } from 'react';
import { Form, Input, message, Tree } from 'antd';
import { get } from '../../utils/request';
const TreeNode = Tree.TreeNode;
const { Search } = Input;
// const treeDataMsg  = [];
class Index extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],//树节点展开key
      treeData: [],
      copyTree: [],//备份 treeData
      copyExpandedKeys: [], //备份 展开key 
      searchValue: "",
      autoExpandParent: false, //是否自动展开父节点
      treeDataMsg: [],
    }
  }
  componentDidMount() {
    this.getTreeData()
  }

  // 处理接口返回数据
  eachReplaceKey = (city) => {
    let item = [];
    city.map(list => {
      let newData = {};
      newData.title = list.name;
      newData.key = list.id;
      newData.order = list.order;
      newData.parentId = list.parentId;
      if (list.children) {
        newData.children = this.eachReplaceKey(list.children)
      }
      item.push(newData);
    })
    return item;
  }
  //  获取组织树数据
  getTreeData = () => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg')) || {};
    get('getOrganizationTree', {
      userId: userLoginMsg.id,
      departmentId: userLoginMsg.departmentId,
    })
      .then((res) => {
        if (res) {
          const data = this.eachReplaceKey(res);
          let firstOrgan = [
            {
                title: '总公司',
                key: 0,
            }
          ]
          firstOrgan[0].children = data
          this.setState({
            treeDataMsg: firstOrgan
          }, () => {
            const msg = this.expandedKeysFun(this.state.treeDataMsg); //展开key
            const cp = JSON.stringify(this.state.treeDataMsg); //深拷贝
            this.setState({
              treeData: this.state.treeDataMsg,
              expandedKeys: msg,
              copyTree: cp,
              copyExpandedKeys: msg
            })
          })
        }
      })
  }

  arrayTreeFilter = (data, predicate, filterText) => {
    const nodes = data;
    // 如果已经没有节点了，结束递归
    if (!(nodes && nodes.length)) {
      return;
    }
    const newChildren = [];
    for (const node of nodes) {
      if (predicate(node, filterText)) {
        // 如果自己（节点）符合条件，直接加入到新的节点集
        newChildren.push(node);
        // 并接着处理其 children,（因为父节点符合，子节点一定要在，所以这一步就不递归了）
        node.children = this.arrayTreeFilter(node.children, predicate, filterText);
      } else {
        // 如果自己不符合条件，需要根据子集来判断它是否将其加入新节点集
        // 根据递归调用 arrayTreeFilter() 的返回值来判断
        const subs = this.arrayTreeFilter(node.children, predicate, filterText);
        // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
        // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
        // 2. 自己本身符合条件
        if ((subs && subs.length) || predicate(node, filterText)) {
          node.children = subs;
          newChildren.push(node);
        }
      }
    }
    return newChildren;
  }

   //过滤函数
  filterFn = (data, filterText) => {
    if (!filterText) {
      return true;
    }
    return (
      new RegExp(filterText, "i").test(data.title) //这个是title过滤 ，也可以根据需求改动
    );
  }
  //展开 key函数
  expandedKeysFun = (e) => {
    if (e && e.length == 0) {
      return [];
    }
    //console.log(treeData)
    let arr = [];
    const expandedKeysFn = (e) => {
      e.map((item, index) => {
        arr.push(item.key); //如果数据量小放这里可以
        if (item.children && item.children.length > 0) {
          //arr.push(item.key); //如果数据量大放这里可以
          expandedKeysFn(item.children);

        }
      })
    }
    expandedKeysFn(e);
    return arr;
  }
  //搜索框 change事件
  onSearchChange = (e) => {
    const value = e.target.value;
    if (value == "") { //为空时要回到最初 的树节点
      const { copyTree, copyExpandedKeys } = this.state;
      this.setState({
        treeData: JSON.parse(copyTree),
        expandedKeys: copyExpandedKeys,
        autoExpandParent: false,
        searchValue: '',
      })
    } else {
      const { copyTree, copyExpandedKeys } = this.state;
      const res = this.arrayTreeFilter(JSON.parse(copyTree), this.filterFn, value);
      const expkey = this.expandedKeysFun(res);
      this.setState({
        treeData: res,
        expandedKeys: expkey,
        searchValue: value,
        autoExpandParent: true,
      })
    }
  }

  //生成树结构函数
  renderTreeNode = (data) => {
    if (data.length == 0) {
      return
    }
    const { searchValue } = this.state;
    return data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: "red" }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children && item.children.length > 0) {
        return <TreeNode key={item.key} title={title} >
          {
            this.renderTreeNode(item.children)
          }
        </TreeNode>
      }
      return <TreeNode key={item.key} title={title}  ></TreeNode>
    })
  }

  // 展开/收起节点时触发
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };

  // 点击树节点触发
  onSelectChange = (selectedKeys) => {
    if (selectedKeys[0] !== '0') {
      this.props.getUserDataFun(selectedKeys)
    }
  }
  render() {
    const { expandedKeys, treeData, autoExpandParent } = this.state;
    return (
      <div style={{'height':'100vh','overflow':'auto'}}>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="搜索组织名称"
          onChange={this.onSearchChange}
        />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={this.onSelectChange}
        >
          {
            this.renderTreeNode(treeData)
          }
        </Tree>
      </div>
    )
  }

}
export default Index