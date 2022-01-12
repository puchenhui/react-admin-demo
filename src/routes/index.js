import SystemLog from "@/pages/systemLog";
import User from "@/pages/user";
import Census from "@/pages/census";
import SystemAuth from "@/pages/systemAuth";


export const adminRouters = [
    {
      path: '/index',
      component: User,
      isShow:true, //默认显示，如果不显示设为false 
      title: '组织及人员浏览',
      icon: 'user'
    }, 
    {
      path: '/admin',
      title: '系统管理',
      icon: 'setting',
      childrens:[
        {
          path: '/admin/log',
          component: SystemLog,
          title: '系统日志',
        }, 
        {
          path: '/admin/census',
          component: Census,
          title: '统计报表',
        },{
          path: '/admin/auth',
          component: SystemAuth,
          title: '工作授权',
        }
      ]
    } 
]