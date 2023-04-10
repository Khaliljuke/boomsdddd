import mongoose from 'mongoose';

const classe = new mongoose.Schema({

    id: {
        "type": "String"
    },
    className: {
        "type": "String"
    },
    nameSchema: {
        "type": "String"
    },
    attrs: {
        "type": [
            "Mixed"
        ]
    }

}, { timestamps: true })

const Classe = mongoose.model('classes', classe);
const ClasseSchema = classe;
export { Classe, ClasseSchema };