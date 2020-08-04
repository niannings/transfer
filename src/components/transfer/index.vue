<template>
  <transfer-base v-model="data" :props="props" @change="handleChange" :loading="$attrs.loading" />
</template>

<script>
import TransferBase from "./transfer-base";

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: Array,
    dataSource: {
      type: Array,
      required: true,
    },
    props: {
      default: () => ({}),
    },
    titles: {
      type: Array,
      default: () => ["title-1", "title-2"],
    },
    allowSearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: false,
      data: [
        {
          title: this.titles[0],
          allowSearch: this.allowSearch,
          list: [],
        },
        {
          title: this.titles[1],
          allowSearch: this.allowSearch,
          list: [],
        },
      ],
    };
  },
  watch: {
    dataSource: {
      immediate: true,
      handler() {
        this.handOut();
      },
    },
  },
  methods: {
    handleChange() {
      const keyName = this.props.key;
      this.$emit(
        "change",
        keyName
          ? this.data[1].list.map((item) => item[keyName])
          : this.data[1].list
      );
    },
    handOut() {
      const d1 = [];
      const d2 = [];
      this.dataSource.forEach((item) => {
        if (this.value.includes(item[this.props.key] || item)) {
          d2.push(item);
        } else {
          d1.push(item);
        }
      });
      this.data[0].list = Object.freeze(d1);
      this.data[1].list = Object.freeze(d2);
    },
  },
  components: {
    TransferBase,
  },
};
</script>
