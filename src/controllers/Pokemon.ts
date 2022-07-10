import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Pokemon from '../models/Pokemon';

const createPokemon = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const pokemon = new Pokemon({
        _id: new mongoose.Types.ObjectId(),
        name
    });

    return pokemon
        .save()
        .then((pokemon) => res.status(201).json({ pokemon }))
        .catch((error) => res.status(500).json({ message: error }));
};

const readPokemon = (req: Request, res: Response, next: NextFunction) => {
    const pokemonId = req.params.pokemonId;

    return Pokemon.findById(pokemonId)
        .then((pokemon) =>
            pokemon
                ? res.status(200).json({ pokemon })
                : res.status(404).json({ message: 'Not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const readAllPokemon = (req: Request, res: Response, next: NextFunction) => {
    return Pokemon.find()
        .then((pokemon) => res.status(200).json({ pokemon }))
        .catch((error) => res.status(500).json({ message: error }));
};

const updatePokemon = (req: Request, res: Response, next: NextFunction) => {
    const pokemonId = req.params.pokemonId;
    console.log(pokemonId);

    return Pokemon.findByIdAndUpdate(pokemonId, req.body)
        .then((pokemon) =>
            pokemon
                ? res.status(201).json({ pokemon })
                : res.status(404).json({ message: 'Not found' })
        )
        .catch((error) => res.status(500).json({ message: error }));
};

const deletePokemon = (req: Request, res: Response, next: NextFunction) => {
    const pokemonId = req.params.pokemonId;

    return Pokemon.findByIdAndDelete(pokemonId)
        .then((pokemon) =>
            pokemon
                ? res.status(201).json({ message: 'Deleted' })
                : res.status(404).json({ message: 'Not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default { createPokemon, readPokemon, readAllPokemon, updatePokemon, deletePokemon };
