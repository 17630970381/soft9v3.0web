//多病预测
import request from "@/utils/request";
// testpost无用，可删
export function testpost(params1, params2, params3, params4, params5) {
  return request({
    method: "post",
    url: "/runtime_bus/submit",
    data: {
      symptom1: params1,
      symptom2: params2,
      symptom3: params3,
      symptom4: params4,
      symptom5: params5,
    },
  });
}

//心脏病单例预测
export function heartPost(feature) {
  return request({
    method: "post",
    url: "/runtime_bus/submit-sp.heart",
    data: feature
  });
}

// 获取按部位分的疾病列表
export function diseasePost() {
  return request({
    method: "post",
    url: "/Diseases/api/diseases/findbypartNameAndNameAndCode",
  });
}

//健康资讯页面发送疾病码
export function disInfoGet(code) {
  return request({
    method: "get",
    url: "/Diseases/api/diseases/findbycode",
    params: {
      code: code,
    },
  });
}


//发送patientID用于预测
export function heartPost2(id) {
  return request({
    method: "post",
    url: "/runtime_bus/submit-sp.heart1",
    data: id,
    timeout: 20000,
  });
}

//新增病例接口
export function patientAddPost(data) {
  return request({
    method: "post",
    url: "PatientHeartAll/add",
    data
  })
}

// 删除病人
export function patientDelRequest(id) {
  return request({
    method: "post",
    url: "PatientHeartAll/delete/"+id,
  });
}

// 获取指定数据表内容
export function dataInfoPost(url,id) {
  return request({
    method: "post",
    url,
    data: id
  });
}

export function testget(params1, params2) {
  return request({
    method: "post",
    url: "/test/get",
    params: {
      params1: params1,
      params2: params2,
    },
  });
}

export function getRequest(url,param) {
  return request({
    method: "get",
    url,
    params:param
  });
}

export function postRequest(url, data) {
  return request({
    method: "post",
    url,
    data
  })
}

export function delRequest(url, data) {
  return request({
    method: "delete",
    url,
    data
  })
}
