import { React, Component, Fragment } from 'react'
import { Tree, Input } from 'antd';
import { get } from '@/utils/request';
import './index.less';

const { TreeNode } = Tree;
const { Search } = Input;

const treeData  = [
  {
      title: '0-0',
      key: '0-0',
      children: [
          {
              title: '0-0-0',
              key: '0-0-0',
              children: [
                  { title: 'pp', key: '0-0-0-0' },
                  { title: '0-0-0-1', key: '0-0-0-1' },
                  { title: 'qq', key: '0-0-0-2' },
              ],
          },
          {
              title: '0-0-1',
              key: '0-0-1',
              children: [
                  { title: '0-0-1-0', key: '0-0-1-0' },
                  { title: '0-0-1-1', key: '0-0-1-1' },
                  { title: '0-0-1-2', key: '0-0-1-2' },
              ],
          },
          {
              title: '0-0-2',
              key: '0-0-2',
          },
      ],
  },
  {
      title: '99',
      key: '0-1',
      children: [
          { title: '0-1-0-0', key: '0-1-0-0' },
          { title: '9988', key: '0-1-0-1' },
          { 
            title: '0-1-0-2-99988', 
            key: '0-1-0-2',
            children:[
              { title: 'www', key: '1-1-0-0' },
              { title: '2-1-0-0', key: '2-1-0-0' },
              { title: '3-1-0-0', key: '3-1-0-0' },
            ]
         },
      ],
  },
  {
      title: '0-2',
      key: '0-2',
  },
];

class DreeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],//树节点展开key
      treeData: [],
      copyTree: [],//备份 treeData
      copyExpandedKeys: [], //备份 展开key 
      searchValue: "",
      autoExpandParent:false, //是否自动展开父节点
    //   treeData: [
    //     {
    //       title: '总公司',
    //       key: 0,
    //     }
    //   ],
    };
   
  }
  componentDidMount() {
  //  this.getTreeData();
    let a = this.expandedKeysFun(treeData); //展开key
    let cp = JSON.stringify(treeData); //这个是最简单的 深拷贝
    this.setState({
      treeData: treeData,
      expandedKeys: a,
      copyTree: cp,
      copyExpandedKeys: a
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

  filterFn = (data, filterText) => { //过滤函数
    if (!filterText) {
      return true;
    }
    return (
      new RegExp(filterText, "i").test(data.title) //我是一title过滤 ，你可以根据自己需求改动
    );
  }
  flatTreeFun = (treeData) => { //扁平化 tree
    let arr = [];
    const flatTree = (treeData) => {
        treeData.map((item, index) => {
            arr.push(item);
            if (item.children && item.children.length > 0) {
                flatTree(item.children);
                item.children = [];
            }
        })
    }
    flatTree(treeData);
    return arr;
  }
  expandedKeysFun = (treeData) => { //展开 key函数
    if (treeData && treeData.length == 0) {
        return [];
    }
    //console.log(treeData)
    let arr = [];
    const expandedKeysFn = (treeData) => {
        treeData.map((item, index) => {
            arr.push(item.key);
            if (item.children && item.children.length > 0) {
                expandedKeysFn(item.children);
            }
        })
    }
    expandedKeysFn(treeData);
    return arr;
}
  onChange = (e) => { //搜索框 change事件
    let value = e.target.value;
    if (value == "") { //为空时要回到最初 的树节点
      let  { copyTree, copyExpandedKeys } = this.state;
      this.setState({
        treeData: JSON.parse(copyTree),
        expandedKeys: copyExpandedKeys,
        autoExpandParent: false,
        searchValue: "",
      })
    } else {
      let res = this.arrayTreeFilter(treeData, this.filterFn, value);
      let expkey = this.expandedKeysFun(res);
      this.setState({
        treeData: res,
        expandedKeys: expkey,
        searchValue: value,
        autoExpandParent: true,
      })
    }
  }

  renderTreeNode = (data) => { //生成树结构函数
    if (data.length == 0) {
        return
    }
    let { expandedKeys, searchValue } = this.state;
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

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
    });
  };



  getTreeData = () => {
    const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg'))
    get('getOrganizationTree',{
      userId:userLoginMsg.id,
      departmentId: userLoginMsg.departmentId,
    })
      .then((res) => {
        // const children = res.map(({ fullName, id, order, type }) => ({ title: fullName, key: id, order, type }))
        // let treeOldData = this.state.treeData;
        // treeOldData[0].children = children
        // this.setState({
        //   treeData: treeOldData
        // })
      })
  }
  // // 点击树节点触发
  // onSelectChange = (selectedKeys, info) => {  
  //   // info.node.props.dataRef为选中树节点里的所有数据
  //     this.props.getUserDataFun(info.node.props.dataRef) 
  //     // console.log(info.node.props.dataRef);
  //     // console.log('id:' + selectedKeys[0]);
  // }

  // // 展开/收起节点时触发
  // onShowExpand = expandedKeys => {
  //   console.log(expandedKeys);
  //     this.setState({
  //         expandedKeys,
  //         autoExpandParent: false,
  //     });
  // };


  render() {
    let  { expandedKeys, treeData, autoExpandParent } = this.state;

    return (
      <Fragment>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          // checkable
          height={500}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        // treeData={treeData}
        >
          {
            this.renderTreeNode(treeData)
          }
        </Tree>

        {/* <Search 
                  className='treeSearch'
                  placeholder="搜索组织名称" 
                  onChange={this.onSearchChange} 
                /> */}
        {/* <Tree
                    className='treeData-box'
                    // loadData={this.onLoadData}
                    onSelect={this.onSelectChange} // 点击树节点触发
                    onExpand={this.onShowExpand} // 展开/收起节点时触发
                    // expandedKeys={expandedKeys} // （受控）展开指定的树节点
                    // autoExpandParent={autoExpandParent} // 是否自动展开父节点
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </Tree> */}


      </Fragment>
    );
  }
}

export default DreeData;
