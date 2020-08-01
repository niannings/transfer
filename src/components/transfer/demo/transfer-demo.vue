<template>
  <div>
    <h3>输入数据量：当前数据量（{{n}}条）</h3>
    <div class="action">
      <el-input class="input" v-model.number="n"/>
      <el-button type="primary" @click="fillData">生成数据</el-button>
    </div>
    <wl-transfer
      v-model="transferedValue"
      :props="{label: 'name', key: 'id', disabled: 'disabled'}"
      :titles="['待穿梭', '已穿梭']"
      :data-source="data"
    ></wl-transfer>
    <pre style="text-align: left; width: 400px; white-space: pre-wrap; word-break: break-all; float: right">data: {{JSON.stringify(transferedValue)}}</pre>
  </div>
</template>

<script>
import WlTransfer from "../index";

function fakeData(n) {
  const result = Array(n)
    .fill(null)
    .map((_, index) => Object.freeze({
      name: `data -- (${index})`,
      id: index,
      disabled: index % 2 === 0
    }));
  return result
}

export default {
  name: "App",
  data() {
    return {
      n: 99999,
      data: [],
      transferedValue: []
    };
  },
  methods: {
    fillData() {
      this.data = Object.freeze(fakeData(this.n));
    }
  },
  components: {
    WlTransfer
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
