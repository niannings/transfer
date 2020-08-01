<template>
  <div id="app">
    <el-tabs v-model="activeName">
      <el-tab-pane label="双子穿梭" name="transfer-demo">
        <transfer-demo/>
      </el-tab-pane>
      <el-tab-pane label="多子穿梭" name="transfer-base-demo">
        <transfer-base-demo/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TransferDemo from "./components/transfer/demo/transfer-demo";
import TransferBaseDemo from "./components/transfer/demo/transfer-base-demo";

export default {
  name: "App",
  data() {
    return {
      activeName: 'transfer-demo'
    }
  },
  components: {
    TransferDemo,
    TransferBaseDemo
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
</style>
