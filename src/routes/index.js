import Admin from "@/pages/admin";
import Login from "@/pages/login";
import User from "@/pages/user";
import Page404 from "@/pages/page404";

// import NewList from "../pages/admin/newList/list";
// import NewEdit from "../pages/admin/newList/edit";
// import CarList from "../pages/admin/car/list";
// import CarDetails from "../pages/admin/car/details";
// import ShopIndex from "../pages/admin/shop";
// import ShopList from "../pages/admin/shop/list";
// import ShopDetails from "../pages/admin/shop/details";

export const mainRouters = [{
    path: '/login',
    component: Login,
}, {
    path: '/404',
    component: Page404,
}]

export const adminRouters = [
    {
        path: '/admin/index',
        component: Admin,
        isShow: true,
        exact: true,
        title: '操作日志',
        icon: 'area-chart'
    }, 
    {
      path: '/admin/user',
      component: User,
      isShow: true,
      exact: true,
      title: '人员信息',
      icon: 'user'
  }, 
    // {
    //     path: '/admin/newList',
    //     component: NewList,
    //     isShow: true,
    //     title: '新闻',
    //     icon: 'shop',
    // }, 
    // {
    //     path: '/admin/car/list',
    //     component: CarList,
    //     isShow: true,
    //     icon: 'shop',
    //     title: '汽车列表',
    // }, 
    // {
    //     path: '/admin/car/details',
    //     component: CarDetails,
    //     isShow: true,
    //     exact: true,
    //     title: '汽车详情',
    //     icon: 'area-chart'
    // }, 
    // {
    //     path: '/admin/newList',
    //     // component: NewList,
    //     isShow: true,
    //     title: '新闻',
    //     icon: 'shop',
    //     childrens:[
    //         {
    //             path: '/admin/newList/edit/:id?',
    //             component: NewEdit,
    //             isShow: false,
    //             title: '新闻编辑',
    //         },
    //         {
    //             path: '/admin/newList/ed',
    //             component: ShopList,
    //             isShow: false,
    //             title: '新闻列表',
    //         },
    //     ]
    // },
    // {
    //     path: '/admin/shop',
    //     component: ShopIndex,
    //     isShow: true,
    //     exact: true,
    //     title: '商品',
    //     icon: 'shop',
    //     childrens:[
    //         {
    //             path: '/admin/shop/shopList',
    //             component: ShopList,
    //             exact: true,
    //             isShow: true,
    //             title: '商品列表',
    //             icon: 'shop',
    //         },
    //         {
    //             path: '/admin/shop/shopDetails',
    //             component: ShopDetails,
    //             exact: true,
    //             isShow: true,
    //             title: '商品详情',
    //             icon: 'shop',
    //         },
    //     ]
    // }, 
]