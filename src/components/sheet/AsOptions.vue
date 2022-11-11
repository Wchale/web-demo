<template>
  <div class="options" :style="{flexDirection: (status?'raw':'column') } ">
    <div class="item" v-for="index in subOptions" :key="index">{{optionsTitle(index)}}</div>
  </div>
</template>

<script>
export default {
    name:'options',
    props:['status', 'subOptions'],
    methods:{
        optionsTitle(index){
            return String.fromCharCode(this.num+index) 
        }
    },
    data(){
        return{
            num:64
        }
    },
    mounted(){
    }
}
</script>

<style scoped>
.options {
    display: flex;
}
.item {
    border: 1px solid #f00;
    width: 15px;
    height: 8px;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f00;
    margin: 1px ;
}
</style>