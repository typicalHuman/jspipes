<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center">


    <div class="grid grid-cols-5" v-if="board">
      <Piece v-for="piece in board.pieces.flat()" :kind="piece.sides" :state="piece.state" />
    </div>

  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from "vue";
import Piece from "./components/Piece.vue";
import { Generator } from "./logic/Generator";

const board: any = ref(null);

onMounted(async () => {
  board.value = await Generator.generateBoard(5, 10, "50", 30_000);
  console.log(board.value);
})


</script>