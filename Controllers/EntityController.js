import { Classe } from "../Models/Classe.js";

export const addClass = (req, res, next) => {
    let classe = new Classe({
        id: req.body.id,
        className: req.body.className,
        nameSchema: req.body.nameSchema,
        attrs: req.body.attrs
    })
    classe.save()
        .then(response => {
            res.json({
                message: "class Added Successfully"
            })

        })
        .catch((err) => {
            res.status(500).json({
                message: "an error occured when adding class"
            });
        });
}

export async function updateClasse(req, res) {
    let newClasse = {};
    var { name, c1, c2, c1IsMany, c2IsMany, attrs } = req.body;
    newClasse = {
        name,
        c1,
        c2,
        c1IsMany,
        c2IsMany,
        attrs
    }
    //TO DO
}



export const getClasses = (req, res, next) => {

    Classe.find()
        .then(classes => {
            res.json(classes)
        })
        .catch(error => {
            res.json({
                message: "an error occured when displaying classes"
            })
        })
}


