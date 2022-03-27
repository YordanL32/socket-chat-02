const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios')
const {crearMensajes} = require('../utilidades/utilidades')
const usuarios = new Usuarios()
io.on('connection', (client) => {

   client.on('entrarChat',(usuario, callback)=>{
   console.log(usuario)
    if(!usuario.nombre || !usuario.sala){
        return callback({
            error:true,
            mensaje:'Nombre es necesario'
        })
    }
    client.join(usuario.sala)
    usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala)
   client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSalas(usuario.sala))
     callback(usuarios.getPersonasPorSalas(usuario.sala))
   })
   client.on('crearMensaje', (data)=>{
       let persona = usuarios.getPersona(client.id)
    let mensaje = crearMensajes(persona.nombre, data.mensaje)
    client.broadcast.to(persona.sala).emit('crearMensajes', mensaje)
   })
   client.on('disconnect', ()=>{
     let personaBorrada =   usuarios.borrarPersona( client.id )
     client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensajes('Administrador', `${personaBorrada.nombre} abandono el chat`))
     client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSalas(personaBorrada.sala))
   })
   //mensajes privados
   client.on('mensajePrivado', data=>{
       let persona = usuarios.getPersona(client.id)
       client.broadcast.to(data.para).emit('mensajePrivado', crearMensajes(persona.nombre, data.mensaje))
   })
});