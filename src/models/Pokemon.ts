import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import { ISpeciesModel } from './Species';

export interface IPokemonModel extends Document {
    name: string;
    species: Schema.Types.ObjectId | ISpeciesModel;
    level: number;
    gender: string;
}

const PokemonSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        validator: {
            validator(name: string) {
                return validator.isAlpha(name);
            }
        }
    },
    species: { type: Schema.Types.ObjectId, required: true, ref: 'Species' },
    level: {
        type: Number,
        required: true,
        default: 1,
        validator: {
            validator(level: number) {
                return level <= 100 && level >= 1;
            }
        }
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    }
});

export default mongoose.model<IPokemonModel>('Pokemon', PokemonSchema);
