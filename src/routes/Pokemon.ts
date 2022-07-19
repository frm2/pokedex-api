import express from 'express';
import controller from '../controllers/Pokemon';

const router = express.Router();

router.post('/create', controller.createPokemon);
router.get('/get/:pokemonId', controller.readPokemon);
router.get('/get', controller.readAllPokemon);
router.patch('/update/:pokemonId', controller.updatePokemon);
router.delete('/delete/:pokemonId', controller.deletePokemon);
router.post('/breed', controller.breedPokemon);

export default router;
