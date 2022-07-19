import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

export interface ISpeciesModel extends Document {
    number: number;
    name: string;
    img: string;
    type: [string];
    stats: {
        hp: number;
        attack: number;
        defense: number;
        spattack: number;
        spdefense: number;
        speed: number;
    };
    moves: {
        level: [{ learnedat: string; name: string; gen: string }];
        tmhm: [{ learnedat: string; name: string; gen: string }];
        egg: [{ learnedat: string; name: string }];
        tutor: [{ name: string; gen: string }];
        gen34: [{ name: string; method: string }];
    };
    damages: {
        normal: number;
        fire: number;
        water: number;
        electric: number;
        grass: number;
        ice: number;
        fight: number;
        poison: number;
        ground: number;
        flying: number;
        psychic: number;
        bug: number;
        rock: number;
        ghost: number;
        dragon: number;
        dark: number;
        steel: number;
    };
    misc: {
        sex: {
            male: number;
            female: number;
        };
    };
    abilities: {
        normal: [string];
        hidden: [string];
    };
    classification: string;
    height: string;
    weight: string;
    capturerate: number;
    eggsteps: number;
    expgrowth: number;
    happiness: number;
    evpoints: [string];
    fleeflag: number;
    entreeforestlevel: number;
    egggroup: [string];
    baby: string;
}

const SpeciesSchema: Schema = new Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        validator: {
            validator(name: string) {
                return validator.isAlpha(name); //Only has letters in the name
            }
        }
    },
    img: {
        type: String,
        required: false
    },
    type: [
        {
            type: String,
            enum: [
                'Normal',
                'Fire',
                'Water',
                'Electric',
                'Grass',
                'Ice',
                'Fighting',
                'Poison',
                'Ground',
                'Flying',
                'Psychic',
                'Bug',
                'Rock',
                'Ghost',
                'Dragon',
                'Dark',
                'Steel'
            ],
            required: true,
            validator: {
                validator(types: [String]) {
                    return types.length in [1, 2]; //there has to be either 1 or 2 types
                }
            }
        }
    ],
    stats: {
        hp: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        spattack: {
            type: Number,
            required: true
        },
        spdefense: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        }
    },
    moves: {
        level: [
            {
                learnedat: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                gen: {
                    type: String,
                    required: true
                }
            }
        ],
        tmhm: [
            {
                learnedat: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                gen: {
                    type: String,
                    required: true
                }
            }
        ],
        egg: [
            {
                learnedat: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                }
            }
        ],
        tutor: [
            {
                name: {
                    type: String,
                    required: true
                },
                gen: {
                    type: String,
                    required: true
                }
            }
        ],
        gen34: [
            {
                name: {
                    type: String,
                    required: true
                },
                method: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    damages: {
        normal: {
            type: Number,
            required: true
        },
        fire: {
            type: Number,
            required: true
        },
        water: {
            type: Number,
            required: true
        },
        electric: {
            type: Number,
            required: true
        },
        grass: {
            type: Number,
            required: true
        },
        ice: {
            type: Number,
            required: true
        },
        fight: {
            type: Number,
            required: true
        },
        poison: {
            type: Number,
            required: true
        },
        ground: {
            type: Number,
            required: true
        },
        flying: {
            type: Number,
            required: true
        },
        psychic: {
            type: Number,
            required: true
        },
        bug: {
            type: Number,
            required: true
        },
        rock: {
            type: Number,
            required: true
        },
        ghost: {
            type: Number,
            required: true
        },
        dragon: {
            type: Number,
            required: true
        },
        dark: {
            type: Number,
            required: true
        },
        steel: {
            type: Number,
            required: true
        }
    },
    misc: {
        sex: {
            male: {
                type: Number,
                required: true
            },
            female: {
                type: Number,
                required: true
            }
        },
        abilities: {
            normal: {
                type: [
                    {
                        type: String,
                        required: true
                    }
                ],
                required: true
            },
            hidden: {
                type: [
                    {
                        type: String,
                        required: true
                    }
                ],
                required: true
            }
        }
    },
    classification: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    capturerate: {
        type: Number,
        required: true
    },
    eggsteps: {
        type: Number,
        required: true
    },
    expgrowth: {
        type: Number,
        required: true
    },
    happiness: {
        type: Number,
        required: true
    },
    evpoints: {
        type: [String],
        required: true
    },
    fleeflag: {
        type: Number,
        required: true
    },
    entreeforestlevel: {
        type: Number,
        required: true
    },
    egggroup: [
        {
            type: String,
            required: true,
            validator: {
                validator(egggroup: [String]) {
                    return egggroup.length in [1, 2];
                    //there has to be either 1 or 2 egg groups
                }
            }
        }
    ]
    //offspring: { type: Schema.Types.ObjectId, required: true, ref: 'Species' }
});

export default mongoose.model<ISpeciesModel>('Species', SpeciesSchema);
