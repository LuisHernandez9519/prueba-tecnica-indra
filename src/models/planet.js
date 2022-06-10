function Planet(data) {
    this.nombre = data.name
    this.periodo_rotacion = data.rotation_period
    this.periodo_orbital = data.orbital_period
    this.diametro = data.diameter
    this.clima = data.climate
    this.gravedad = data.gravity
    this.terreno = data.terrain
    this.superficie_agua = data.surface_water
    this.poblacion = data.population
    this.residentes = data.residents
    this.peliculas = data.films
    this.creado = data.created
    this.editado = data.edited
}

module.exports = Planet