import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface IPokemonModel extends Document {
    name: string;
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
    }
});

export default mongoose.model<IPokemonModel>('Pokemon', PokemonSchema);
