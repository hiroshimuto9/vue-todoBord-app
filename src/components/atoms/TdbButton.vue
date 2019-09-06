<template>
  <button
    :class="classes"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'TdbButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // typeに応じてクラスを動的に生成
    classes () {
      const cls = this.type === 'text' ? ('-' + this.type) : ''
      return [`tdb-button${cls}`]
    }
  },
  methods: {
    // clickイベントを発行
    handleClick (ev) {
      this.$emit('click', ev)
    }
  }
}
</script>

<style scoped>
.tdb-button {
  padding: .6em 1.3em
}
.tdb-button-text {
  border: none;
  padding-left: 0;
  padding-right: 0;
}
</style>
