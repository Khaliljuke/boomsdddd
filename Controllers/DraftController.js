import Draft from "../Models/Draft.js";

export const addDraft = (req, res, next) => {
    let draft = new Draft({
        name: req.body.name,
        classes: [],
    })
    draft.save()
        .then(response => {
            res.json(response)

        })
        .catch((err) => {
            res.status(500).json({
                message: "an error occured when adding draft"
            });
        });
}


export const getDrafts = (req, res, next) => {

    Draft.find()
        .then(drafts => {
            res.json(drafts)
        })
        .catch(error => {
            res.json({
                message: "an error occured when displaying drafts"
            })
        })
}

export const getDraft = (req, res, next) => {
    const id = req.params.id;

    Draft.findOne({ '_id': id })
        .then(draft => {
            res.json(draft)
        })
        .catch(error => {
            res.json({
                message: "an error occured when displaying draft"
            })
        })
}

export const updateDraft = (req, res, next) => {
    const id = req.params.id;

    Draft.findOneAndUpdate(
        { _id: id },
        {
            name: req.body.name,
            classes: req.body.classes,
        })
        .then(draft => {
            res.json({
                message: "draft updated successfully"
            })
        })
        .catch(error => {
            res.json({
                message: "an error occured when displaying draft"
            })
        })
}

