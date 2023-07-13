const { io } = require("../index");
const Band = require("../models/band");
const Bands = require("../models/bands");

const bands = new Bands();

bands.addBand(new Band("Queen"));
bands.addBand(new Band("Bon Jovi"));
bands.addBand(new Band("Bastile"));
bands.addBand(new Band("Metalica"));

// Mensajes de Sockets

io.on("connection", (client) => {
  console.log("Cliente Conectado");

  client.emit("active-bands", bands.getBands());

  client.on("disconnect", () => {
    console.log("Cliente Desconectado");
  });

  client.on("mensaje", (payload) => {
    console.log("Mensaje!!!", payload);

    io.emit("mensaje", { admin: "Nuevo Mensaje" });
  });

  client.on("nuevo-mensaje", (data) => {
    // io.emit('nuevo-mensaje', data);
    client.broadcast.emit("nuevo-mensaje", data);
  });

  client.on("vote-band", (vote) => {
    console.log(vote);
    bands.voteBand(vote.id);
    io.emit("active-bands", bands.getBands());
  });

  client.on("add-band", (band) => {
    console.log(band);
    bandtoAdd = new Band(band.name);
    bands.addBand(bandtoAdd);
    io.emit("active-bands", bands.getBands());
  });

  client.on("delete-band", (band) => {
    console.log(band);
    bands.deleteBand(band.id);
    io.emit("active-bands", bands.getBands());
  });

});
