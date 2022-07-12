# **pokedex-api**

PokedexAPI is a database of pokémon using Mongodb, Typescript, and NodeJS that can be interacted
with REST requests.

## Usage

pokedex-api has no frontend, and as such, you must use a tool like Postman to emulate REST requests.
The current supported commands are:

| Method     | Route                      | Description                                                                                         |
| ---------- | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `[GET]`    | `/pkmn/get`                | Creates a Pokémon with the information contained in the body of the request.                        |
| `[GET]`    | `/pkmn/get/<pokemonID>`    | Finds the Pokémon with the ID contained in the URL of the request.                                  |
| `[POST]`   | `/pkmn/create`             | Creates a Pokémon with the information contained in the body of the request.                        |
| `[PATCH]`  | `/pkmn/update/<pokemonID>` | Updates the Pokémon of the ID in the URL with the information contained in the body of the request. |
| `[DELETE]` | `/pkmn/delete/<pokemonID>` | Deletes the Pokémon of the ID in the URL in the body of the request.                                |

## Database

The **Pokemon** collection follows the current schema:

```typescript
const PokemonSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        validator: {
            validator(name: string) {
                return validator.isAlpha(name); //can only contain letters
            }
        }
    }
});
```
