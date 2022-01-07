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
      title: '组织及人员浏览',
      icon: 'user'
  }, 
]