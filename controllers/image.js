const constant = require('../constants');

const handleApiClarify = (req, res) => {

    const { USER_ID, PAT, APP_ID, MODEL_ID, MODEL_VERSION_ID } = constant;

    // Start of Clarifai
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": req.body.input
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => {
            res.json(result);
        })
        .catch(error => res.status(400).json('Unable to call Clarify API'));
    // End of Clarifai
}

const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users').where('id', '=', id).increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleImage,
    handleApiClarify
}