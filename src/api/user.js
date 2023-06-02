import request from '@/utils/request'
export function test(params1,params2){
return request({
    method:'post',
    url:'/test',
    data:{
        params1:params1,
        params2:params2,
    }
})
}