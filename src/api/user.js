//多病预测
import request from "@/utils/request";
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
export function heartPost(age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal) {
  return request({
    method: "post",
    url: "/runtime_bus/submit-sp.heart",
    data: {
      age: age,
      sex: sex,
      cp: cp,
      trestbps: trestbps,
      chol: chol,
      fbs: fbs,
      restecg: restecg,
      thalach: thalach,
      exang: exang,
      oldpeak: oldpeak,
      slope: slope,
      ca: ca,
      thal: thal,
    },
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

//获取病人概要信息
export function patientGet() {
  return request({
    method: "get",
    url: "/Patient/patients",
  });
}

//获取病人详细信息
export function patientDetailGet(url) {
  return request({
    method: "get",
    url: url,
  });
}

//发送patientID用于预测
export function heartPost2(id) {
  return request({
    method: "post",
    url: "/runtime_bus/submit-sp.heart1",
    data: {
      patientId: id
    }
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
