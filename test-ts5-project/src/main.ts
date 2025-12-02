import { createTimeRandId, getUrlParam, toDayjs, getObjectKeys } from '@base-web-kits/base-tools-ts';

console.log('Testing @base-web-kits/base-tools-ts...');

// 测试 base-tools-ts 的功能
const timeRandId = createTimeRandId();
console.log('createTimeRandId:', timeRandId);

const urlParams = getUrlParam('test', 'http://example.com?test=hello');
console.log('getUrlParam:', urlParams);

const dayjsObj = toDayjs('2024-01-01');
console.log('toDayjs:', dayjsObj.format('YYYY-MM-DD'));

const testObj = { a: 1, b: 2, c: 3 };
const keys = getObjectKeys(testObj);
console.log('getObjectKeys:', keys);

// 渲染结果到页面
const resultDiv = document.getElementById('result');
if (resultDiv) {
  resultDiv.innerHTML = `
    <h2>测试结果：</h2>
    <p>✅ createTimeRandId: ${timeRandId}</p>
    <p>✅ getUrlParam: ${urlParams}</p>
    <p>✅ toDayjs: ${dayjsObj.format('YYYY-MM-DD')}</p>
    <p>✅ getObjectKeys: [${keys.join(', ')}]</p>
    <p style="color: green;">base-tools-ts 测试通过！</p>
  `;
}