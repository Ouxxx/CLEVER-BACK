const User = require('../models/user')


/* ajoute un user dans la table */
exports.addOne = data => {
    return new Promise((resolve,reject) => {
        console.log('on rentre dans ce then. data :')
        console.log(data)
        const user = new User(data);
        user.save()
        .then(() => { 
            resolve({ 
                state: 'SUCCESS', 
                message: 'Utilisateur créé !'
            })
        })
        .catch(error => { 
            console.log('on rentre dans ce catch')
            reject({ 
                state: 'ERROR',
                error: error
            })
        })
    })   
}


exports.updateOne = (filter,data) => {
    return new Promise((resolve,reject) => {
        User.findOneAndUpdate(filter,data)
            .then(res => {
                resolve({ state: 'SUCCESS', res: res });
            })
            .catch(error => {
                reject( {state: 'ERROR', error: error })                
            })
    })
}





exports.getOne = data => {
    console.log('Entre dans getOne ...')
    return new Promise((resolve,reject) => {
        User.findOne(data)
        .then(user => {
            if(user){
                console.log('utilisateur trouvé !')
                resolve({
                    state: 'SUCCESS',
                    finded: true,
                    user: user
                })
            } else {
                console.log('Utilisateur introuvable ! ')
                resolve({
                    state: 'SUCCESS',
                    finded: false
                })
            }
        })
        .catch(error => {
            reject({
                state: 'ERROR',
                error: error
            })
        })
    })
}