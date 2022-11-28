const fetch = require('node-fetch');

const handleApiClarify = (req, res) => {

    const { CLA_USER_ID, CLA_PAT, CLA_APP_ID, CLA_MODEL_ID, CLA_MODEL_VERSION_ID } = process.env;

    // Start of Clarifai
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": CLA_USER_ID,
            "app_id": CLA_APP_ID
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
            'Authorization': 'Key ' + CLA_PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + CLA_MODEL_ID + "/versions/" + CLA_MODEL_VERSION_ID + "/outputs", requestOptions)
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