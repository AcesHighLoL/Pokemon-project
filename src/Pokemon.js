import 


const searchPokemon = () => {

    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`

    Axios.get(pokemonUrl).then((response) => {
      console.log(response)
      const abilities = response.data.abilities.map(ability => {
        return ability.ability.name.toLowerCase().split('-').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join('');
      })

      const types = response.data.types.map(type => type.type.name)

      setPokemon({
        name: pokemon,
        species: response.data.species.name,
        img: response.data.sprites.front_default,
        type: types,
        abilities: abilities
      })
    })

    Axios.get(pokemonSpeciesUrl).then((response) => {
      console.log(response)
      
      let description;
      response.data.flavor_text_entries.map(flavor => {
        if (flavor.language.name === "en") {
          description = flavor.flavor_text
          return;
        }
      })

      const catchRate = Math.round((100 / 255) * response.data['capture_rate']);

      setPokemon({
        description: description,
        catchRate: catchRate
      })
    })

    setPokemonChosen(true)
  }