import { useEffect, useState } from 'react';
import { setLocalStorage, getLocalStorage } from '@base-web-kits/base-tools-web';
import { createRandId, toDayjs, findLastIndex } from '@base-web-kits/base-tools-ts';
import './App.css';

function App() {
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const results: string[] = [];

    try {
      // 测试 base-tools-ts 的功能
      results.push(`✅ Random ID: ${createRandId()}`);

      // 测试 toDayjs
      const now = new Date();
      const dayjsObj = toDayjs(now);
      results.push(`✅ toDayjs: ${dayjsObj.format('YYYY-MM-DD HH:mm:ss')}`);

      // 测试 Lodash 方法
      const testArray = [1, 2, 3, 4, 2];
      const lastIndex = findLastIndex(testArray, (x) => x === 2);
      results.push(`✅ Lodash: findLastIndex=${lastIndex}`);

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
      <h1>Base Tools 测试 (TS 4.x + React)</h1>
      <div className="results">
        {testResults.map((result, index) => (
          <p key={index}>{result}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
