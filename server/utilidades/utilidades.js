const crearMensajes = (nombre, mensaje)=>{
    return {
        nombre,
        mensaje,
        Fecha: new Date().getTime()
    }
}   
module.exports = {
    crearMensajes
}