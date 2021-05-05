import list from './list';
import { createButton } from '../../common/utils';

export function getButtonElement(listTargetElement) {
  return createButton('Product', () => {
    // 显示 list内容
    listTargetElement.innerHTML = list.map(item => `<li>${item}</li>`).join('');
  });
}