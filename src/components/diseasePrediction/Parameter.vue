<template>
<div>
<h1>pppp</h1>
  <span>{{this.publicSelectedAlgorithms}}</span>
  <span>{{this.selectedAlgorithms}}</span>
  <span>{{this.electionAl}}</span>
</div>
</template>


<script>
export default {
  name: "Parameter",
  props: {
    selectedAlgorithms: Array,
    publicSelectedAlgorithms: Array,
    electionAl: String
  },
}
</script>


<style>

</style>