const CodeValidator = require('../models/codeValidator')

/* ajoute un user dans la table */
exports.addOne = data => {
    
    return new Promise((resolve,reject) => {
        console.log('email :' + data.identifier)
        console.log('type :' + data.verificationType)

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