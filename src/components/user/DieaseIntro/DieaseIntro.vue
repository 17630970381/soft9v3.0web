
<template>
 
        <!-- <h1>这里写人体和疾病介绍</h1> -->
        <!-- <Body></Body> -->
        <div class="container">
            <div class="left">
                <Body></Body>
            </div>
            <div class="right">
                <Info></Info>
            </div>
        </div>
   
</template>

<script>
import Body from './components/Body.vue'
import Info from './components/Info.vue'
export default {
    // eslint-disable-next-line vue/no-unused-components
    components:{Body:Body,Info:Info}
}
</script>

<style scoped>
.container{
    display: flex;
    justify-content: space-between;
    /* background-color: #516; */
    width: 100%;
    height: 100%;
}
.left{
    overflow: hidden;
    background-color: rgb(255, 255, 255);
    flex: 1;
}
.right{
    background-color: rgb(240, 240, 240);
    flex: 2;
}
</style>