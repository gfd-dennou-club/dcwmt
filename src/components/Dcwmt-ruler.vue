<template>
    <div id="ruler">
        <div :id=vertical>aa</div>
        <div :id=holizonal>aa</div>
    </div>
</template>

<script>
export default {
    props: ["viewer"],
    data: () => ({
        vertical: "vertical",
        holizonal: "holizonal"
    }),
    mounted: function () {
        Array.prototype.forEach.call(this.$el.children, ele => {
            if ( ele.id === this.vertical ) {
                
            }
        })
    }
}
</script>

<style scoped>
  div#ruler>div {
    position: absolute;
    bottom: 0;
    z-index: 1;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
  }
  div#vertical {
    background-color: green; /* for test */
    top: 0;
  }
  div#horizonal {
    background-color: yellow; /* for test */
    left: 0;
    right: 0;
  }
</style>
