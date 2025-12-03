import {
  createTimeRandId,
  getUrlParam,
  toDayjs,
  getObjectKeys,
  EventBus,
  findLastIndex,
} from '@base-web-kits/base-tools-ts';
import { setLocalStorage, getLocalStorage, isMobile } from '@base-web-kits/base-tools-web';

// 测试 base-tools-ts 的功能
const timeRandId = createTimeRandId();

const urlParams = getUrlParam('test', 'http://example.com?test=hello');

const now = new Date();
const dayjsObj = toDayjs(now);

const testObj = { a: 1, b: 2, c: 3 };
const keys = getObjectKeys(testObj);

// 测试 Lodash 方法
const testArray = [1, 2, 3, 4, 2];
const lastIndex = findLastIndex(testArray, (x) => x === 2);

// 测试 EventBus
const emitter = new EventBus();
emitter.on('test', (data) => {
  console.log('EventBus received:', data);
});
emitter.emit('test', 'Hello EventBus!');

// 测试 base-tools-web 的功能
setLocalStorage('test-key', { id: 1, name: '测试数据', timestamp: Date.now() });
const storedValue = getLocalStorage('test-key');

// 渲染结果到页面
const resultDiv = document.getElementById('result');
if (resultDiv) {
  resultDiv.innerHTML = `
    <h1>Base Tools 测试 (TS 5.x + Vite)</h1>
    <h2>TS 工具测试结果：</h2>
    <p>✅ createTimeRandId: ${timeRandId}</p>
    <p>✅ getUrlParam: ${urlParams}</p>
    <p>✅ toDayjs: ${dayjsObj.format('YYYY-MM-DD HH:mm:ss')}</p>
    <p>✅ getObjectKeys: [${keys.join(', ')}]</p>
    <p>✅ EventBus: 事件发布订阅功能测试成功</p>
    
    <h3>Lodash 测试结果：</h3>
    <p>✅ findLastIndex: ${lastIndex}</p>
    
    <h3>Web 工具测试结果：</h3>
    <p>✅ Storage: ${JSON.stringify(storedValue)}</p>
    <p>✅ Device: 当前设备是${isMobile() ? '移动' : '桌面'}设备</p>
  `;
}
