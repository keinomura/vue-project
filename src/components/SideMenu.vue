<template>
    <div class="side-menu">
      <h3>入院サマリ</h3>
      <ul>
        <li><a href="#" @click.prevent="menuClicked('/summary')">入院サマリ</a></li>
      </ul>
      <h3>退院サマリ</h3>
      <ul>
        <li><a href="#" @click.prevent="menuClicked('/stroke')">脳梗塞</a></li>
        <li><a href="#" @click.prevent="menuClicked('/stroke')">脳出血</a></li>
      </ul>
      <h3>手術名</h3>
      <ul>
        <li><a href="#" @click.prevent="menuClicked('/surgery')">Clipping</a></li>
        <li><a href="#" @click.prevent="menuClicked('/surgery')">CSDH</a></li>
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
  