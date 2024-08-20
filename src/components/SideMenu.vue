<template>
    <div class="side-menu">
      <h3>入退院サマリ</h3>
      <ul>
        <li><a href="#" @click.prevent="menuClicked('/summaryFrame/hospitalization')">入院サマリ</a></li>
        <li><a href="#" @click.prevent="menuClicked('/summaryFrame/discharge')">退院サマリ</a></li>
      </ul>
      <h3>手術記録</h3>
      <ul>
        <li><a href="#" @click.prevent="menuClicked('/summaryFrame/operationRecord')">手術記録</a></li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      menuClicked(path) {
        this.$emit('menu-clicked', path);
      }
    }
  }
  </script>
  
  <style>
  .side-menu {
    width: 20%;
    border-right: 1px solid #ccc;
    padding: 10px;
  }
  </style>
  