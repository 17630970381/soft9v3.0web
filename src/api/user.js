import request from "@/utils/request";
export function testpost(params1, params2) {
  return request({
    method: "post",
    url: "/test/post",
    data: {
      params1: params1,
      params2: params2,
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
