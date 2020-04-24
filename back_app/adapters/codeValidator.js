const CodeValidator = require('../models/codeValidator')

/* ajoute un user dans la table */
exports.addOne = data => {
    
    return new Promise((resolve,reject) => {
        const codeForm = new CodeValidator(data);
        codeForm.save()
        .then(() => { 
            resolve({ 
                state: 'SUCCESS', 
                message: 'Code en attente de verification'
            })
        })
        .catch(error => { 
            reject({ 
                state: 'ERROR',
                error
            })
        })
    })   
}

/* recherche un user dans la table en fontion de l'objet 'data' */
exports.findOne = data => {
    return new Promise( (resolve,reject) => {
        CodeValidator.findOne(data)
        .then(code => {
            if(!code) {
                resolve({ state: 'SUCCESS'});
            } else {
                resolve({ state: 'SUCCESS', code: code });
            }
        })
        .catch(error => {
            reject( {state: 'ERROR', error: error })
        })
    })
    
}

exports.deleteOne = data => {
    return new Promise((resolve, reject) => {
        CodeValidator.deleteOne(data)
        .then(() => resolve({
            state: 'SUCCESS',
            message: 'Utilisateur identifié !'
        }))
        .catch(error => {
            reject({
                state: 'ERROR',
                error: error
            })
        })
    })
}