import './App.css';
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Container, spacing } from '@mui/system';
import Typography from '@mui/material/Typography';
import Axios from "axios"
import { Box, Chip } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TYPE_COLORS_CODE = {
  water: '3295F6',
  fire: 'E73B0C',
  grass: '74C236',
  bug: '81C12E',
  dragon: '755EDF',
  electric: 'FCBC17',
  fairy: 'F4B1F4',
  flying: 'A3B3F7',
  ghost: '6060B2',
  ground: 'D3B357',
  ice: 'A3E7FD',
  normal: 'CBC4BC',
  poison: '934594',
  psychic: 'ED4882',
  rock: '89A156',
  steel: 'B5B5C3'
}

function App() {

  const [pokemonName, setPokemonName] = useState("")
  const [pokemonChosen, setPokemonChosen] = useState(false)
  const [pokemonSpec, setPokemonSpec] = useState({
    description: "",
    catchRate: ""
  })
  const [pokemon, setPokemon] = useState({
    name: "",
    species: "",
    img: "",
    type: [],
    abilities: [],
  })

  const searchPokemon = () => {

    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`

    Axios.get(pokemonUrl).then((response) => {
      console.log(response)
      const abilities = response.data.abilities.map(ability => {
        return ability.ability.name.toLowerCase().split('-').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join('');
      })
      console.log(abilities)

      const types = response.data.types.map(type => type.type.name)

      console.log(types)

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

      setPokemonSpec({
        description: description,
        catchRate: catchRate
      })
    })

    setPokemonChosen(true)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <div className="title">
          <h1>Pokemon Search</h1>
          <TextField id="outlined-basic" label="Search Pokemon" variant="outlined" onChange={(event) => setPokemonName(event.target.value.toLowerCase())} />
          <Button variant="contained" className="search-button" sx={{ mt: 2 }} onClick={searchPokemon}>Search</Button>
        </div>

        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }} >
          {!pokemonChosen ? <Typography variant="h4" display="flex" justifyContent="center" >Please choose a Pokemon</Typography> :
            <Container>

              <Typography variant="h3" display="flex" justifyContent="center"
                alignItems="center"
                sx={{ textTransform: 'capitalize' }}>
                {pokemon.species}
              </Typography>

              <Box sx={{ width: 600 }} display="flex"
                justifyContent="center"
                alignItems="center">
                <img
                  src={pokemon.img}
                />
                <Box display="flex" justifyContent="center" flexDirection="column">
                  <Typography variant="body1" color="">
                    <Typography sx={{ fontWeight: 'bold' }}>Description:</Typography>
                    {pokemonSpec.description}
                  </Typography>
                  <Typography variant="body1" color="">
                    <Typography sx={{ fontWeight: 'bold' }}>Abilities:</Typography>
                    {pokemon.abilities}
                  </Typography>
                  <Typography variant="body1" color="">
                    <Typography sx={{ fontWeight: 'bold' }}>Typing:</Typography>
                    {pokemon.type.map((types) => (
                      <Chip label= {types} key={types} sx={{ mr:1, mt:1 ,borderRadius: 6, textTransform: 'capitalize', backgroundColor: `#${TYPE_COLORS_CODE[types]}`, color: 'white' }}
                      />
                      
                     
                    ))}

                  </Typography>

                </Box>
              </Box>

            </Container>
          }
        </Container>

      </div>
    </ThemeProvider >
  );
}

export default App;
