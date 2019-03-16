<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'">
        <q-toolbar-title>
          VTT Generator
          <div slot="subtitle">Duc Nguyen</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>
    <q-page-container style="height:100%;">
      <rightMain/>
    </q-page-container>
  </q-layout>
</template>

<script>
import rightMain from './sub/rightMain.vue'
export default {
  name: 'MyLayout',
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    rightMain
  }
}
</script>

<style>
</style>
