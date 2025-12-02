import React, { useEffect, useState } from 'react';
import { setLocalStorage, getLocalStorage } from '@base-web-kits/base-tools-web';
import { createRandId } from '@base-web-kits/base-tools-ts';
// import { createTimeRandId, getUrlParam, toDayjs, getObjectKeys } from '@base-web-kits/base-tools-ts'
// import { setLocalStorage, getLocalStorage } from '@base-web-kits/base-tools-web'
import './App.css';

function App() {
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const results: string[] = [];

    try {
      // 测试 base-tools-ts 的功能
      results.push(`✅ Random ID: ${createRandId()}`);
      // const timeRandId = createTimeRandId()
      // results.push(`✅ createTimeRandId: ${timeRandId}`)

      // const urlParams = getUrlParam('test', 'http://example.com?test=hello')
      // results.push(`✅ getUrlParam: ${urlParams}`)

      // const dayjsObj = toDayjs('2024-01-01')
      // results.push(`✅ toDayjs: ${dayjsObj.format('YYYY-MM-DD')}`)

      // const testObj = { a: 1, b: 2, c: 3 }
      // const keys = getObjectKeys(testObj)
      // results.push(`✅ getObjectKeys: [${keys.join(', ')}]`)

      // 测试 base-tools-web 的功能
      setLocalStorage('test-key', 'test-value-123');
      const storedValue = getLocalStorage('test-key');
      results.push(`✅ LocalStorage: ${storedValue}`);

      results.push('🎉 所有功能测试通过！');
    } catch (error) {
      results.push(`❌ 错误: ${error}`);
    }

    setTestResults(results);
    console.log('Test results:', results);
  }, []);

  return (
    <div className="App">
      <h1>TS4 Base Tools 测试</h1>
      <div className="results">
        {testResults.map((result, index) => (
          <p key={index}>{result}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
