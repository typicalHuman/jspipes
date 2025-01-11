<template>
    <div class="flex items-center justify-center bg-transparent   w-24 h-24  transition-transform duration-200 ease-in-out"
        @click="rotate()" :style="{ transform: `rotate(${rotationDegree}deg)` }">

        <component v-if="kind > 0" :is="images[kind]" />
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from "vue";
import PieceOneSided from "./pieces/PieceOneSided.vue";
import PieceTwoSidedA from "./pieces/PieceTwoSidedA.vue";
import PieceTwoSidedB from "./pieces/PieceTwoSidedB.vue";
import PieceThreeSided from "./pieces/PieceThreeSided.vue";
import PieceFourSided from "./pieces/PieceFourSided.vue";

const props = defineProps(["kind", "state"]);


const images: any = {
    [1]: PieceOneSided,
    [2]: PieceTwoSidedB,
    [2.5]: PieceTwoSidedA,
    [3]: PieceThreeSided,
    [4]: PieceFourSided,
}



const rotationDegree = ref(0);
function rotate() {
    rotationDegree.value = rotationDegree.value + 90;
}

onMounted(() => {
    rotationDegree.value = 90 * props.state
})


</script>