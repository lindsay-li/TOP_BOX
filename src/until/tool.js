/*some handles*/
 /*转换时间 */
export function changeTime(time){
    if(!time){return}
    let date = new Date(time);
    let Y = date.getFullYear();
    let M = date.getMonth()+1 >=10 ?date.getMonth()+1:'0' + (date.getMonth()+1);
    let D = date.getDate() >= 10 ? date.getDate():'0' + date.getDate() ;
    return `${Y}.${M}.${D}`
}