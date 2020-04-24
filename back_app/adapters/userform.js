
const Uservalidator = require('../models/uservalidator')

/* ajoute un user dans la table */
exports.addOne = data => {
    
    return new Promise((resolve,reject) => {
        const user = new Uservalidator(data);
        user.save()
        .then(() => { 
            resolve({ 
                state: 'SUCCESS', 
                message: 'Utilisateur en attente de validation !'
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
        Uservalidator.findOne(data)
        .then(user => {
            if(!user) {
                resolve({ state: 'SUCCESS'});
            } else {
                resolve({ state: 'SUCCESS', user: user });
            }
        })
        .catch(error => {
            reject( {state: 'ERROR', error: error })
        })
    })
    
}

exports.deleteOne = data => {
    return new Promise((resolve, reject) => {
        Uservalidator.deleteOne(data)
        .then(() => resolve({
            state: 'SUCCESS',
            message: 'L\'utilisateur n\'est plus en attente de validation'
        }))
        .catch(error => {
            reject({
                state: 'ERROR',
                error: error
            })
        })
    })
}

