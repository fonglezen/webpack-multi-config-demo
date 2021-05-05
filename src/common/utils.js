export function createButton(innerText, clickListener) {
  const button = document.createElement('button');
  button.innerText = innerText;
  button.addEventListener('click', clickListener);
  return button;
}