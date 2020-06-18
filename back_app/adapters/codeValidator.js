const CodeValidator = require('../models/codeValidator')

/* ajoute un user dans la table */
exports.addOne = data => {
    
    return new Promise((resolve,reject) => {
        
        CodeValidator.findOneAndUpdate({
            identifier: data.identifier
        },{
            verificationType : data.verificationType,
            code : data.code,
            checked: false
        },{
            new: true,
            upsert: true // Make this update into an upsert
        })
        .then((res) => { 
            console.log(res)
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

/* recherche un code dans la table en fontion de l'objet 'data' et le renvoie si trouvé */
exports.findOne = data => {
    return new Promise( (resolve,reject) => {
        CodeValidator.findOne(data)
        .then(doc => {
            if(!doc) {
                resolve({ state: 'SUCCESS'});
            } else {
                resolve({ state: 'SUCCESS', doc: doc });
            }
        })
        .catch(error => {
            reject( {state: 'ERROR', error: error })
        })
    })
    
}


exports.updateOne = (filter,data) => {
    return new Promise((resolve,reject) => {
        CodeValidator.findOneAndUpdate(filter,data)
        .then(res => {
            console.log(res);
            resolve({ state: 'SUCCESS', res: res });
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
            message: 'Utilisateur supprime !'
        }))
        .catch(error => {
            reject({
                state: 'ERROR',
                error: error
            })
        })
    })
}