import { message } from "antd";
import { post } from "./request";

/**
 * 处理返回的excel文件流
 * =>应该有可以处理别的格式的，把excel改为想要的格式可以测试一下
 * @export 直接导出文件
 * @param {*} res 返回数据流
 * @param {string} name 若不传，默认为统计表
 */
 const exportFile = (res,name='统计表') => {
  const blob = new Blob([res.data]);
  const fileName = name + (new Date()).valueOf() + '.xlsx';
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}
/**
 *
 *点击下载按钮
 * @export file文件
 * @param {*} data 导出数据类型（必须包含type）以及查询条件
 * @param {*} name 下载文件名称
 */
export function downloadFile(data,departmentId,name){

  // const userLoginMsg = JSON.parse(window.localStorage.getItem('userLoginMsg'))
  /****
   * 导出数据类型 type
   * 1：导出所在部门人的全部操作日志  传type= 1 departmentId
   * 2：按操作人名字导出日志 传type= 2 departmentId userName 
   * 3：按操作时间段导出日志 传type= 3 departmentId startTime endTime
   * 4：按操作人操作的时间段导出日志 传type= 4 departmentId userName startTime endTime
   * 5：导出部门成员表  传type= 5 departmentId
   */
  if (departmentId) {
    post('/export',{
      ...data,
      departmentId,
    },{
      responseType:'blob',
      header:{
        'Content-Type':'application/json;charset=UTF-8',
      }
    })
    .then((res)=>{
      exportFile(res,name)
    })
  } else {
    message.error('请先选择组织后再进行导出')
  }
    
}
