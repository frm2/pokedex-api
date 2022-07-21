import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Pokemon, { IPokemonModel } from '../models/Pokemon';
import Species, { ISpeciesModel } from '../models/Species';
import { Type } from 'typescript';

Species;

enum TypeofCouple {
    INVALID = -1,
    REGULAR,
    DITTO
}

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    NONE = ''
}

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
    console.log('Breeding Pokémon');
    const { id1, id2, name } = req.body;
    console.log(`${id1} - ${id2}`);
    //Searches both pokémon given in the body and then applies the business rules
    return await Pokemon.find({ _id: { $in: [id1, id2] } })
        .populate<{ species: ISpeciesModel }>('species')
        .then((pokemons) => {
            const coupleType: TypeofCouple = validateParents([pokemons[0], pokemons[1]]);
            pokemons.length == 2
                ? coupleType != TypeofCouple.INVALID
                    ? createOffspring([pokemons[0], pokemons[1]], coupleType, name)
                          .save()
                          .then((pokemon) => res.status(201).json({ pokemon }))
                          .catch((error) => res.status(500).json({ message: error }))
                    : res.status(400).json({ message: 'Parents failed validation' })
                : res.status(404).json({ message: 'Did not find both parents' });
        })
        .catch((error) => res.status(500).json({ message: error }));
};

const isDitto = (pokemon: IPokemonModel) => {
    const species = pokemon.species as ISpeciesModel;
    if (species.name == 'Ditto') return true;
    return false;
};

const isFertile = (pokemon: IPokemonModel) => {
    const species = pokemon.species as ISpeciesModel;
    if (species.egggroup.includes('NO EGGS')) return false;
    return true;
};

const bothGenders = (pokemons: [IPokemonModel, IPokemonModel]) => {
    if (
        (pokemons[0].gender == 'Male' && pokemons[1].gender == 'Female') ||
        (pokemons[1].gender == 'Male' && pokemons[0].gender == 'Female')
    ) {
        return true;
    }
    return false;
};

const getGender = (species: ISpeciesModel) => {
    const maleChance = species.misc.sex.male;
    const femaleChance = species.misc.sex.female;

    if (maleChance == 0) {
        if (femaleChance == 0) {
            return Gender.NONE;
        } else {
            return Gender.FEMALE;
        }
    } else if (femaleChance == 0) {
        return Gender.MALE;
    } else {
        const random = Math.random() * (maleChance + femaleChance);
        console.log(
            `MaleChance: [${maleChance}] FemaleChance: [${femaleChance}] Random: [${random}]`
        );
        if (random > maleChance) {
            console.log('Offspring is female');
            return Gender.FEMALE;
        } else {
            console.log('Offspring is male');
            return Gender.MALE;
        }
    }
};

/**
 * checks for valid pokémon pairings for breeding offspring
 * there are two valid pairings
 *      - two fertile pokémon that belong to >=1 similar egg group, one male and one female
 *      - one ditto and any other fertile pokémon
 * (a pokémon is fertile if it doesn't contain the "NO EGGS" egg group)
 * @param parents
 * @returns
 */
const validateParents = (parents: [IPokemonModel, IPokemonModel]): TypeofCouple => {
    console.log('Validating parents');

    const parent1 = parents[0];
    const parent2 = parents[1];

    console.log(parents.length);

    parents.forEach((parent) => {
        const speciesmodel = parent.species as ISpeciesModel;
        console.log(
            `id: ${parent.id}, gender: ${parent.gender}, speciesname: ${speciesmodel.name}, number: ${speciesmodel.number}, id:${speciesmodel._id}, egggroups:${speciesmodel.egggroup}`
        );
    });

    console.log(isDitto(parent1));
    console.log(isDitto(parent2));

    //Exclusive OR - checks if exactly one of the two parents is a Ditto
    if (isDitto(parent1) ? !isDitto(parent2) : isDitto(parent2)) {
        if (isFertile(parent1) && isFertile(parent2)) {
            console.log('Couple successfully validated as a [DITTO] couple');
            return TypeofCouple.DITTO;
        }
    } else if (bothGenders(parents)) {
        const species1 = parent1.species as ISpeciesModel;
        const species2 = parent2.species as ISpeciesModel;
        //This returns true if both species share at least one egg group in common
        if (species1.egggroup.some((x) => species2.egggroup.includes(x))) {
            console.log('Couple successfully validated as a [REGULAR] couple');
            return TypeofCouple.REGULAR;
        }
    }
    return TypeofCouple.INVALID;
};

const createOffspring = (
    parents: [IPokemonModel, IPokemonModel],
    coupleType: TypeofCouple,
    name: String
) => {
    let primaryParent: IPokemonModel;
    let secondaryParent: IPokemonModel;

    /** Resolves who is the primary parent, a.k.a. the one that defines the offspring's species and more */
    if (coupleType == TypeofCouple.DITTO) {
        if (isDitto(parents[0])) {
            primaryParent = parents[1];
            secondaryParent = parents[0];
        } else {
            primaryParent = parents[0];
            secondaryParent = parents[1];
        }
    } else if (coupleType == TypeofCouple.REGULAR) {
        if (parents[0].gender == 'Female') {
            primaryParent = parents[0];
            secondaryParent = parents[1];
        } else {
            primaryParent = parents[1];
            secondaryParent = parents[0];
        }
    } else {
        throw new Error('Invalid couple');
    }

    const species = primaryParent.species as ISpeciesModel;

    const gender = getGender(species);

    if (gender == Gender.NONE) {
        return new Pokemon({
            _id: new mongoose.Types.ObjectId(),
            name,
            species
        });
    }
    return new Pokemon({
        _id: new mongoose.Types.ObjectId(),
        name,
        species,
        gender
    });
};

export default {
    createPokemon,
    readPokemon,
    readAllPokemon,
    updatePokemon,
    deletePokemon,
    breedPokemon
};
