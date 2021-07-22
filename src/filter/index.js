let changeNum = num => {
    if(!num){return ''}
    let price = num + '';
    return price.split('.')[0]
}
let changeFloat = num => {
    if(!num){return ''}
    let price = num + '';
    if(price.split('.').length<2){
        return '.00'
    }else{
        return '.'+price.split('.')[1]
    }
}
let getNum = str => {
    if(!str){return ''}
    return str.replace(/[^0-9]/ig,"");
}
export { changeNum, changeFloat ,getNum}