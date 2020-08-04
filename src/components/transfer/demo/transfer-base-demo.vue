<template>
  <div id="app">
    <!-- <img width="25%" src="./assets/logo.png"> -->
    输入穿梭框的数量(量力而行😄)
    <div class="action">
      <el-input class="input" v-model="n"/>
      <el-button type="primary" @click="handleClick">生成数据</el-button>
    </div>
    <wl-transfer-base v-model="data" :props="{format: '{name} -- ({id})', key: 'id'}"/>
    <!-- <pre style="text-align: left">data: {{JSON.stringify(data, null, 2)}}</pre> -->
  </div>
</template>

<script>
import WlTransferBase from "../transfer-base";

function fakeData(n = 3) {
  const listTemplate = n =>
    Array(n)
      .fill(null)
      .map((_, index) => ({
        name: 'data',
        id: index,
        disabled: index % 2 !== 0
      }));
  const template = n =>
    Array(n)
      .fill(null)
      .map((_, index) => ({
        title: "列表" + (index + 1),
        list: listTemplate(2 * (n - index)),
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
      this.data = fakeData(this.n | 0);
    },
    handleClick() {
      const data = fakeData(this.n | 0)
      this.data = [data.shift(), data.shift()]
      const run = () => {
        setTimeout(() => {
          if (data.length > 0) {
            this.data.push(data.shift())
            run()
          }
        })
      }
      run()
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
