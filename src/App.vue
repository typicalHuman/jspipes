<template>
  <div class="min-h-screen flex flex-col gap-y-3 items-center justify-stretch"
    :style="{ backgroundColor: `${bgColor}` }">
    <div class="flex flex-row items-stretch w-full justify-stretch">
      <div class="absolute flex flex-row ml-3 mt-3">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="35">
            <path fill="none" d="M0 0h24v24H0z" />
            <path :fill="pieceColor" d="M7 7h3V4h4v3h3l-5 5-5-5zM17 17h-3v3h-4v-3h-3l5-5 5 5z" />
          </svg>

        </div>
        <div>
          <input type="tel" id="x" class="bg-transparent border-b outline-none  block w-7 p-1" placeholder="X"
            v-model="sizeX" :style="{ color: pieceColor, border: pieceColor }" />
        </div>
        <div class="ml-3">
          <input type="tel" id="y" class="bg-transparent border-b  outline-none block w-7 p-1" placeholder="Y"
            v-model="sizeY" :style="{ color: pieceColor, border: pieceColor }" />
        </div>
        <div class="flex items-center ml-3">
          <input id="default-checkbox" type="checkbox" value="" v-model="isRandomColors"
            class="w-4 h-4   rounded   focus:ring-2" :style="{ color: bgColor, border: pieceColor }">
          <label for="default-checkbox" class="ms-2 text-sm font-medium" :style="{ color: pieceColor }">RNG
            colors</label>
        </div>
      </div>
      <h1 class="text-5xl mt-3 self-center justify-center text-center items-center flex-grow select-none"
        :style="{ color: pieceColor }">{{ level }}</h1>
    </div>

    <div class="grid" :style="{ gridTemplateColumns: `repeat(${sizeX}, minmax(0, 1fr))` }" v-if="board">
      <Piece v-for="piece in board.pieces.flat()" :kind="piece.sides" :state="piece.state" :sizeX="sizeX" :sizeY="sizeY"
        :color="pieceColor" @rotate="(x, y) => rotate(x, y)" :canRotate="canRotate" :x="piece.coordinates.x"
        :y="piece.coordinates.y"
        :key="`${board.pieces.length}_${board.pieces[0].length}_${level}_${piece.coordinates.x}_${piece.coordinates.y}`" />
    </div>

  </div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Piece from "./components/Piece.vue";
import { Generator } from "./logic/Generator";
import { generateBeautifulColors } from "./logic/utils/colorsGenerator";
import { sleep } from "./logic/utils/utils";
import { DEFAULT_BG, DEFAULT_PICE_COLOR, MAX_FIELD_SIZE_X, MAX_FIELD_SIZE_Y, MIN_BOARD_SIZE, SLEEP_TIME } from "./logic/utils/constants";

const board: any = ref(null);

const canRotate = ref(true);
const sizeX = ref(MIN_BOARD_SIZE);
const sizeY = ref(MIN_BOARD_SIZE);
const level = ref(1);



const bgColor = ref(DEFAULT_BG);
const pieceColor = ref(DEFAULT_PICE_COLOR);
const isRandomColors = ref(false);


onMounted(async () => {
  const _level = localStorage.getItem(`size-${sizeX.value}-${sizeY.value}`)
  if (_level) {
    level.value = parseInt(_level)
  }
  sizeX.value = parseInt(localStorage.getItem(`lastSizeX`) ?? MIN_BOARD_SIZE.toString())
  sizeY.value = parseInt(localStorage.getItem(`lastSizeY`) ?? MIN_BOARD_SIZE.toString())
  const _randomColors = localStorage.getItem(`randomColors`)
  isRandomColors.value = _randomColors == "true" ? true : false
  updateBoard();
})


async function rotate(x: number, y: number) {
  board.value.pieces[y][x].rotate();
  console.log(board.value)
  const solved = board.value.checkSolved()
  if (solved) {
    canRotate.value = false
    localStorage.setItem(`lastSizeX`, sizeX.value.toString())
    localStorage.setItem(`lastSizeY`, sizeY.value.toString())
    localStorage.setItem(`size-${sizeX.value}-${sizeY.value}`, (level.value + 1).toString())
    updateBoard();
  }
}

watch(sizeX, (newValue) => {
  if (!newValue || isNaN(newValue))
    return
  if (newValue > MAX_FIELD_SIZE_X) {
    sizeX.value = MAX_FIELD_SIZE_X
  }
  else if (newValue < MIN_BOARD_SIZE) {
    sizeX.value = MIN_BOARD_SIZE
  }
  updateBoard();
})
watch(sizeY, (newValue) => {
  if (!newValue || isNaN(newValue))
    return
  if (newValue > MAX_FIELD_SIZE_Y) {
    sizeY.value = MAX_FIELD_SIZE_Y
  }
  else if (newValue < MIN_BOARD_SIZE) {
    sizeY.value = MIN_BOARD_SIZE
  }
  updateBoard()
})

watch(isRandomColors, () => {
  localStorage.setItem(`randomColors`, isRandomColors.value.toString())
  updateBoard()
})

async function updateBoard() {
  if (board.value != null) {
    canRotate.value = false
    await sleep(SLEEP_TIME)
  }
  board.value = null
  canRotate.value = true
  const _level = localStorage.getItem(`size-${sizeX.value}-${sizeY.value}`)
  if (_level) {
    level.value = parseInt(_level)
  }
  else {
    level.value = 1
  }
  board.value = Generator.generateBoard(parseInt(sizeX.value.toString()), parseInt(sizeY.value.toString()), level.value.toString(), 50_000);
  if (isRandomColors.value) {
    const { baseColor, contrastColor } = generateBeautifulColors(level.value)
    bgColor.value = baseColor;
    pieceColor.value = contrastColor
  }
  else {
    bgColor.value = DEFAULT_BG
    pieceColor.value = DEFAULT_PICE_COLOR
  }
  console.log(board.value)
}

</script>