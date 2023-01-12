import './App.css';
import { useState } from 'react'
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Container, spacing } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

import Axios from "axios"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


function App() {

  const [pokemonName, setPokemonName] = useState("")
  const [pokemonChosen, setPokemonChosen] = useState(false)
  const [pokemon, setPokemon] = useState({
    name: "",
    species: "",
    img: "",
    type: "",
    abilities: "",
    description: "",
    catchRate: ""
  })
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

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <div className="title">
          <h1>Pokemon Search</h1>
          <TextField id="outlined-basic" label="Search Pokemon" variant="outlined" onChange={(event) => setPokemonName(event.target.value.toLowerCase())} />
          <Button variant="contained" className="search-button" sx={{ mt: 2 }} onClick={searchPokemon}>Search</Button>
        </div>
        <div>
          <Container maxWidth="lg" sx={{ mt: 8 }}>
            {!pokemonChosen ? <Typography variant="h4" display="flex" justifyContent="center">Please choose a pokemon</Typography> :
              <Card variant="outlined">
                <CardMedia
                  sx={{ height: 140 }}
                  image="/static/images/cards/contemplative-reptile.jpg"
                  title="green iguana"
                />
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000
                  species, ranging across all continents except Antarctica
                </Typography>
              </Card>
            }
          </Container>
        </div>
      </div>
    </ThemeProvider >
  );
}

export default App;
