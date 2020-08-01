<template>
  <div id="app">
    <!-- <img width="25%" src="./assets/logo.png"> -->
    输入列表数量(不要太大了)
    <div class="action">
      <el-input class="input" v-model="n"/>
      <el-button type="primary" @click="fillData">生成数据</el-button>
    </div>
    <wl-transfer-base v-model="data" :props="{label: 'name', key: 'name'}"/>
    <!-- <pre style="text-align: left">data: {{JSON.stringify(data, null, 2)}}</pre> -->
  </div>
</template>

<script>
import WlTransferBase from "../transfer-base";

function fakeData(n = 3) {
  const listTemplate = n =>
    Array(n)
      .fill(null)
      .map(() => ({
        name: Math.random().toString(16)
      }));
  const template = n =>
    Array(n)
      .fill(null)
      .map((_, index) => ({
        title: "列表" + (index + 1),
        list: listTemplate(Math.pow(2, n - index)),
        allowSearch: true
      }));
  return template(n);
}

export default {
  name: "App",
  data() {
    return {
      n: 3,
      data: []
    };
  },
  created() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.data = fakeData(this.n);
    }
  },
  components: {
    WlTransferBase
  }
};
</script>

<style scoped>
.action {
  display: flex;
  margin-bottom: 20px;
}
.input {
  width: 200px;
  margin-right: 20px;
}
</style>
