<template>
  <div class="checkbox-group">
    <div class="header">
      <slot name="header">
        <!-- <span>卡片名称</span> -->
      </slot>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="isCheckAll"
        @change="handleCheckAllChange"
        >{{ title }}</el-checkbox
      >
    </div>
    <el-input
      v-if="allowSearch"
      v-model="query"
      class="checkbox-filter"
      size="small"
      type="search"
      placeholder="搜索"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <div class="body" v-loading="loading">
      <div v-if="data.length === 0" class="no-data">无数据</div>
      <el-checkbox-group
        :class="{ 'checkbox-vertical': vertical }"
        v-model="checkList"
        @change="handleCheckedChange"
      >
        <template v-if="props">
          <el-checkbox
            v-for="item in listData"
            :key="item[props.key]"
            :label="item[props.key]"
            :disabled="item[props.disabled]"
          >
            {{ item[props.label] }}
          </el-checkbox>
        </template>
        <template v-else>
          <el-checkbox v-for="item in listData" :key="item" :label="item">
            {{ item }}
          </el-checkbox>
        </template>
        <span v-scroll-load="{ data, size: 20, onChange }"></span>
      </el-checkbox-group>
    </div>
    <!-- <pre style="text-align: left">value: {{JSON.stringify(checkList, null, 2)}}</pre>
      <pre style="text-align: left">data: {{JSON.stringify(data, null, 2)}}</pre> -->
  </div>
</template>

<script>
import { eachBigData } from "./utils";

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    dataSource: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
    },
    allowSearch: {
      type: Boolean,
      default: false,
    },
    props: {
      default: () => ({}),
    },
    vertical: Boolean,
  },
  data() {
    return {
      isIndeterminate: false,
      isCheckAll: false,
      query: "",
      listData: [],
      loading: false,
    };
  },
  computed: {
    checkList: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
    data() {
      if (this.allowSearch && this.query) {
        const labelName = this.props.label;
        if (labelName) {
          return this.dataSource.filter(
            (item) =>
              ("" + item[labelName])
                .toLowerCase()
                .indexOf(this.query.toLowerCase()) > -1
          );
        }
        return this.dataSource.filter(
          (item) => item.toLowerCase().indexOf(this.query.toLowerCase()) > -1
        );
      }
      return this.dataSource;
    },
  },
  watch: {
    value(val) {
      if (val.length === 0) {
        this.isCheckAll = false;
        this.isIndeterminate = false;
      }
    },
  },
  methods: {
    async getAllValues() {
      const keyName = this.props.key;
      const disabledName = this.props.disabled;
      let values = [];

      if (keyName) {
        if (this.data.length > 100000) {
          const theEach = eachBigData(this.data, (item) => {
            if (!item[disabledName]) {
              values.push(item[keyName]);
            }
          });
          this.cancelGetAllValues = theEach.cancel;
          try {
            await theEach.future;
          } catch (error) {
            console.log(error);
          }
        } else {
          this.data.forEach((item) => {
            if (!item[disabledName]) {
              values.push(item[keyName]);
            }
          });
        }
      } else {
        values = this.data;
      }

      return values;
    },
    onChange(data) {
      this.listData = data;
    },
    async handleCheckAllChange(checked) {
      this.isIndeterminate = false;
      if (checked) {
        this.loading = true
        this.checkList = Object.freeze(await this.getAllValues());
        this.loading = false
      } else {
        if (this.cancelGetAllValues) {
          this.cancelGetAllValues();
        }
        this.checkList = [];
      }
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.isCheckAll = checkedCount === this.dataSource.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.dataSource.length;
    },
  },
};
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  max-height: 100%;
  box-sizing: border-box;
}
.checkbox-vertical {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.checkbox-vertical /deep/ .el-checkbox {
  line-height: 30px;
}
.header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  background: #f5f7fa;
  margin: 0;
  padding-left: 15px;
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  color: #000;
}
.body {
  position: relative;
}
.body /deep/ .el-checkbox-group {
  margin-left: 15px;
}
.checkbox-filter {
  text-align: center;
  margin: 15px;
  box-sizing: border-box;
  display: block;
  width: auto;
}
.checkbox-filter /deep/ .el-input__inner {
  height: 32px;
  width: 100%;
  font-size: 12px;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 16px;
  padding-right: 10px;
  padding-left: 30px;
}
.no-data {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0;
  height: 30px;
  line-height: 30px;
  padding: 6px 15px 0;
  color: #909399;
  text-align: center;
}
</style>
