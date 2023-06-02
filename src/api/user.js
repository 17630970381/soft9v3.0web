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
