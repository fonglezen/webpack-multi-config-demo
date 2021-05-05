import * as user from './apps/users';
import * as product from './apps/products';

// 创建列表容器
const listContainer = document.createElement('ul');
listContainer.id = 'listContainer';

// 创建2个按钮
const buttonElements = [
  user.getButtonElement(listContainer),
  product.getButtonElement(listContainer),
];

// 添加按钮到 #app 中
buttonElements.forEach(element => document.querySelector('#app').appendChild(element));

// 添加listContainer到 #app 中
document.querySelector('#app').appendChild(listContainer)
