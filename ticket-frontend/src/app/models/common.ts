export interface IApiRes<dataType=unknown>{
    status_code: 'ok'| number,
    data:dataType,
    message:string
  }