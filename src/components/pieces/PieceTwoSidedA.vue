<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="45" y="0" width="10" height="100" :fill="color" />
    </svg>
</template>
<script lang="ts">
import { defineProps, defineComponent } from 'vue';

defineProps(["color"])


export default defineComponent({
    props: {
        color: {
            type: String,
            required: true,
        },
    },
});
</script>