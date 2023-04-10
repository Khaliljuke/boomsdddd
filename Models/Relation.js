const mongoose = require('mongoose');

const relation = new mongoose.Schema({


    "name": {
        "type": "String"
    },
    "c1": {
        "type": "String"
    },
    "c2": {
        "type": "String"
    },
    "c1IsMany": {
        "type": "Boolean"
    },
    "c2IsMany": {
        "type": "Boolean"
    },
    "attrs": {
        "type": [
            "Mixed"
        ]
    }

}, { timestamps: true })

const Relation = mongoose.model('rlations', relation);
module.exports = Relation