import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Pokemon, { IPokemonModel } from '../models/Pokemon';
import Species, { ISpeciesModel } from '../models/Species';

Species;

const createPokemon = (req: Request, res: Response, next: NextFunction) => {
    const { name, species, gender } = req.body;

    const pokemon = new Pokemon({
        _id: new mongoose.Types.ObjectId(),
        name,
        species,
        gender
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

/**
 * Generates a Pokémon using two other Pokémon
 * @param req
 * @param res
 * @param next
 */
const breedPokemon = async (req: Request, res: Response, next: NextFunction) => {
    console.log('Breeding Pokémon...');
    const { id1, id2, name } = req.body;
    console.log(`${id1} - ${id2}`);
    //Searches both pokémon given in the body and then applies the business rules
    const result = await Pokemon.find({ _id: { $in: [id1, id2] } })
        .populate<{ species: ISpeciesModel }>('species')
        .then((parents) => {
            console.log(parents.length);
            validateParents(parents) ? console.log('deu :D') : console.log('nao deu :(');
        });
};

const validateParents = (parents: IPokemonModel[]): boolean => {
    let result = false;

    console.log(parents.length);

    const species1 = parents[0].species as ISpeciesModel;
    const species2 = parents[1].species as ISpeciesModel;

    console.log(species1.egggroup);
    console.log(species2.egggroup);

    //console.log(species.length);

    parents.forEach((parent) => {
        const speciesmodel = parent.species as ISpeciesModel;
        console.log(
            `id: ${parent.id}, gender: ${parent.gender}, speciesname: ${speciesmodel.name}, number: ${speciesmodel.number}, id:${speciesmodel._id}, egggroups:${speciesmodel.egggroup}`
        );
    });

    const isDitto = (species: ISpeciesModel) => {
        if (species.name == 'Ditto') return true;
        return false;
    };

    if (isDitto(species1) ? !isDitto(species2) : isDitto(species2)) {
    }
    for (let index = 0; index < 2; index++) {
        const parent = parents[index];
        const otherIndex = 1 - index;
        const species = parent.species as ISpeciesModel;
        if (species.name == 'Ditto') {
        }
    }

    return result;
};

export default {
    createPokemon,
    readPokemon,
    readAllPokemon,
    updatePokemon,
    deletePokemon,
    breedPokemon
};
