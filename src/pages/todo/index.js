import React, { Component } from 'react';
import 'antd/dist/antd.css'
import { Input , Button , List } from 'antd'
import store from '@/store';
import { changeInputAction,addItemAction,deleItemAction } from '@/store/actionCreators'
class TodoList extends Component {
  constructor(props){
    super(props)
    this.state=store.getState();
    store.subscribe(this.storeChange) // 订阅
  }
  inputChange = (e) => {
    const value = e.target.value;
    const action =changeInputAction(value)
    this.setState({
      inputValue: value
    })
    store.dispatch(action)
  }

  storeChange = () =>{
    this.setState(store.getState())
  }
  
  addArr = () =>{
    const { inputValue } = this.state;
    if (inputValue) {
      const action = addItemAction()
      store.dispatch(action)
    }
    
  }
  
  deleItem = (index) => {
    const action = deleItemAction(index)
    store.dispatch(action)
  }


    render() {  
      const {  list,inputValue } = this.state;
      
        return ( 
            <div style={{margin:'10px'}}>
                <div>
                    <Input
                      placeholder='请输入默认值'
                      value={inputValue}
                      style={{ width:'250px', marginRight:'10px'}}
                      onChange={this.inputChange}
                      onPressEnter={() => this.addArr()}
                      />
                    <Button type="primary"
                      onClick={() => this.addArr()}
                    >增加</Button>
                </div>
                <div style={{margin:'10px',width:'300px'}}>
                    <List
                        bordered
                        dataSource={list}
                        renderItem={
                          (item,index)=>(
                            <List.Item onClick={() => this.deleItem(index)}>{item}</List.Item>
                          )}
                    />    
                </div>
            </div>
         );
    }
}
export default TodoList;