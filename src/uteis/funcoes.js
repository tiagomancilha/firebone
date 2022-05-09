
export default function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
return deg * (Math.PI/180)
}

export function calcularDistanciaTotal(index){
    var total = 0
    var  distancia = 0
    if(index == 0) return 0
    listaDePostesDaMedicao.map((item, i)=>{
        if(index == ( i )) return 0
        if(i == 0){ return 0}   
        const itemLista = listaDePostesDaMedicao[i - 1]
        distancia =  parseInt(1000 * getDistanceFromLatLonInKm(itemLista.latitude,itemLista.longitude, item.latitude, item.longitude))   
        total = total + distancia
    })
    return total    
}