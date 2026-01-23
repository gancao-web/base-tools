<template>
  <div class="tools-test">
    <h1>Base Tools 测试 (Vue 2 非ts环境)</h1>

    <div class="test-section">
      <h2>TS 工具测试</h2>
      <button @click="testToDayjs">测试 toDayjs</button>
      <button @click="testLodash">测试 Lodash</button>
      <div class="result">{{ tsResult }}</div>
    </div>

    <div class="test-section">
      <h2>Web 工具测试</h2>
      <button @click="testStorage">测试 Storage</button>
      <button @click="testDevice">测试 Device</button>
      <div class="result">{{ webResult }}</div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue';
import { toDayjs, uniq } from '@base-web-kits/base-tools-ts';
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  isMobile,
} from '@base-web-kits/base-tools-web';

export default {
  name: 'ToolsTest',
  setup() {
    const tsResult = ref('点击按钮测试 TS 工具...');
    const webResult = ref('点击按钮测试 Web 工具...');
    const vueResult = ref('点击按钮测试 Vue 功能...');

    // 测试 toDayjs
    const testToDayjs = () => {
      try {
        const now = new Date();
        const dayjsObj = toDayjs(now);
        tsResult.value = `toDayjs 测试成功!\n当前日期: ${dayjsObj.format('YYYY-MM-DD HH:mm:ss')}`;
      } catch (error) {
        tsResult.value = `❌ toDayjs测试出错: ${error.message}`;
      }
    };

    // 测试 Lodash
    const testLodash = () => {
      try {
        const testArray = [1, 2, 3, 4, 2];
        const uniqStr = uniq(testArray).toString();

        tsResult.value = `Lodash 测试成功!\n` + `uniq: ${uniqStr}`;
      } catch (error) {
        tsResult.value = `❌ Lodash测试出错: ${error.message}`;
      }
    };

    // 测试 Storage
    const testStorage = () => {
      try {
        const testData = { id: 1, name: '测试数据', timestamp: Date.now() };
        setLocalStorage('testKey', testData);
        const retrievedData = getLocalStorage('testKey');
        removeLocalStorage('testKey');

        webResult.value = `Storage 测试成功!\n存储并获取数据: ${JSON.stringify(retrievedData)}`;
      } catch (error) {
        webResult.value = `❌ Storage测试出错: ${error.message}`;
      }
    };

    // 测试 Device
    const testDevice = () => {
      try {
        const isMobileDevice = isMobile();
        webResult.value = `Device 测试成功!\n当前设备是${isMobileDevice ? '移动' : '桌面'}设备`;
      } catch (error) {
        webResult.value = `❌ Device测试出错: ${error.message}`;
      }
    };

    // 测试 Vue 2 响应式
    const testReactivity = () => {
      try {
        const state = reactive({
          count: 0,
          message: 'Hello Vue 2',
        });

        const doubled = computed(() => state.count * 2);

        // 修改状态
        state.count = 5;

        vueResult.value =
          `Vue 2 响应式测试成功!\n` +
          `reactive: ${state.count}\n` +
          `computed: ${doubled.value}\n` +
          `default value: ${state.message}`;
      } catch (error) {
        vueResult.value = `❌ Vue 2响应式测试出错: ${error.message}`;
      }
    };

    return {
      tsResult,
      webResult,
      vueResult,
      testToDayjs,
      testLodash,
      testStorage,
      testDevice,
      testReactivity,
    };
  },
};
</script>

<style scoped>
.tools-test {
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
}

button:hover {
  background-color: #45a049;
}

.result {
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
