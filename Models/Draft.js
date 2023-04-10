import mongoose from 'mongoose';
import { ClasseSchema } from './Classe.js';

const draft = new mongoose.Schema({
    name: {
        "type": "String"
    },
    classes:[ClasseSchema]
}, { timestamps: true })

const Draft = mongoose.model('drafts', draft);
export default Draft;


