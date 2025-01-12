<template>
    <div class="flex items-center justify-center bg-transparent w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 transition-transform duration-200 ease-in-out"
        @click="rotate()" :style="{ transform: `rotate(${rotationDegree}deg)` }">
        <div :class="`${canRotate ? 'animate-scaleIn' : 'animate-scaleOut'}`">
            <component v-if="kind > 0" :is="images[kind]" :color="color" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, toRefs, onMounted } from "vue";
import PieceOneSided from "./pieces/PieceOneSided.vue";
import PieceTwoSidedA from "./pieces/PieceTwoSidedA.vue";
import PieceTwoSidedB from "./pieces/PieceTwoSidedB.vue";
import PieceThreeSided from "./pieces/PieceThreeSided.vue";
import PieceFourSided from "./pieces/PieceFourSided.vue";

const props = defineProps(["kind", "state", "color", "canRotate", "x", "y"]);
const { canRotate, state, x, y } = toRefs(props)
const emit = defineEmits(['rotate'])

const images: any = {
    [1]: PieceOneSided,
    [2]: PieceTwoSidedB,
    [2.5]: PieceTwoSidedA,
    [3]: PieceThreeSided,
    [4]: PieceFourSided,
}


const rotationDegree = ref(0);
function rotate() {
    if (canRotate?.value) {
        emit("rotate", x?.value, y?.value)
        rotationDegree.value = rotationDegree.value + 90;
    }
}

onMounted(() => {
    rotationDegree.value = 90 * state?.value
})


</script>