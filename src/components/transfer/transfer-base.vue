<template>
  <div
    class="wl-transfer-wrap"
    v-loading="spinning"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255,255,255,.6)"
  >
    <div class="wl-transfer" v-for="(item, index) in dataSource" :key="index">
      <div class="wl-transfer-buttons" v-if="index !== 0">
        <el-button
          round
          type="primary"
          size="small"
          :disabled="!values[index - 1].length"
          @click="transfer(index - 1, index)"
        >
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <el-button
          round
          type="primary"
          size="small"
          icon="el-icon-arrow-left"
          :disabled="!values[index].length"
          @click="transfer(index, index - 1)"
        ></el-button>
      </div>
      <wl-checkbox-group
        v-model="values[index]"
        class="group"
        vertical
        :props="props"
        :allow-search="item.allowSearch"
        :title="item.title"
        :data-source="item.list"
      >
        <template v-slot:header>
          <slot v-bind:index="index"></slot>
        </template>
      </wl-checkbox-group>
    </div>
  </div>
</template>

<script>
import WlCheckboxGroup from "./checkbox-group";
import { filterBigData } from "./utils";

function clone(jsonObj) {
  return JSON.parse(JSON.stringify(jsonObj));
}

export default {
  model: {
    prop: "dataSource",
    event: "change",
  },
  props: {
    dataSource: {
      type: Array,
      required: true,
    },
    props: {
      default: () => ({}),
    },
    loading: Boolean,
  },
  data() {
    return {
      values: [],
      isLoading: false,
    };
  },
  watch: {
    "dataSource.length": {
      immediate: true,
      handler(len) {
        if (len !== this.values.length) {
          this.values = Array(len)
            .fill(null)
            .map(() => []);
        }
      },
    },
  },
  computed: {
    spinning() {
      return this.loading || this.isLoading;
    },
  },
  beforeDestroy() {
    if (typeof this.cancelTransfer === "function") {
      this.cancelTransfer();
    }
  },
  methods: {
    async transfer(from, to) {
      const keyName = this.props.key;
      const cloned = clone(this.dataSource);
      const f = cloned[from];
      const t = cloned[to];
      const fromList = [];
      let toList = [];
      let key;
      if (f.list.length > 20000) {
        const theFilter = filterBigData(f.list, (item) => {
          key = item[keyName] || item;
          if (this.values[from].includes(key)) {
            return true;
          }
          fromList.push(item);
        });
        this.cancelTransfer = theFilter.cancel;
        try {
          this.isLoading = true;
          toList = await theFilter.future;
          this.isLoading = false;
        } catch (error) {
          console.log(error);
        }
      } else {
        toList = f.list.filter((item) => {
          key = item[keyName] || item;
          if (this.values[from].includes(key)) {
            return true;
          }
          fromList.push(item);
        });
      }
      t.list = [...toList, ...t.list];
      f.list = fromList;
      this.values[from] = [];
      this.$emit("change", cloned);
    },
  },
  components: {
    WlCheckboxGroup,
  },
};
</script>

<style scoped>
.wl-transfer-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.wl-transfer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wl-transfer-buttons {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
}
.wl-transfer-buttons button:last-child {
  margin-left: 0;
  margin-top: 20px;
}
.group {
  width: 242px;
}
.group /deep/ .el-checkbox-group {
  max-width: 227px;
  margin-left: 15px;
  padding: 6px 0;
  list-style: none;
  height: 246px;
  overflow: auto;
  box-sizing: border-box;
}
</style>
