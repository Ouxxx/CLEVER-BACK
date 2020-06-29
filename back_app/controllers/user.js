const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userFormAdapter = require('../adapters/userform');
const userAdapter = require('../adapters/user');
const codeValidatorAdapter = require('../adapters/codeValidator')

// genere une chaine de 'size' chiffres
const generateCode = size => {
    var code = '';
    for(var i=0; i<size; i++){
        code += Math.floor(Math.random() * 10);
    }
  return code;
}

exports.saveForm = (req, res, next) => {

    // TODO: verifier que ce qu'on a en entrée est valide

    // création des codes de validation
    const phoneCode = generateCode(10);
    const emailCode = generateCode(10);

    bcryptjs.genSalt(10)
    .then(salt => {
        bcryptjs.hash(req.body.password, salt)
        .then(hash => {

            // sauvegarde du nouvel utilisateur dans la table en attente de verification
            userFormAdapter.addOne({
                email: req.body.email,
                password: hash,
                phone: req.body.phone,
                phoneCode: phoneCode,
                emailCode: emailCode
            })
            .then(success => {
                console.log('phoneCode: ' + phoneCode);
                console.log('emailCode: ' + emailCode);
                res.status(201).json({ success });
            })
            .catch(error => {
                res.status(400).json({ error })
            })
        });
    });
};

exports.signup = (req, res, next) => {
    // verification des codes de validation et recuperation du formulaire
    userFormAdapter.findOne(req.body)
    .then(valid => {
        if(valid.user){
            // generation de l'ID et je le stocke aussi dans la base de donne
            const userId = generateCode(5);

            // sauvegarde du nouvel utilisateur dans la table definitive
            userAdapter.addOne({
                userId: userId,
                email: valid.user.email,
                password: valid.user.password,
                phone: valid.user.phone
            })
            .then( (add_result) => {
                // supprimer l'utilisateur de la table de transition
                userFormAdapter.deleteOne(valid.user)
                .then(() => res.status(201).json({
                    state: 'SUCCESS',
                    userId: userId,
                    message:'Utilisateur créé'
                }))
                .catch(error => 
                    // TODO:  Il faut faire qch pour relancer la suppression
                    res.status(201).json({
                        state: 'SUCCESS',
                        userId: userId,
                        message:'Utilisateur créé'
                }))
            })
            .catch(error => {
                console.log('signup : catch lors de la sauvegarde du nouvel utilisateur dans la table definitive')
                res.status(400).json({ error })
            })

        } else {
            // Les codes sont pas bon
            console.log('on passe ici')
            res.status(400).json({
                state: 'ERROR', 
                message: 'Les codes de verifications ne sont pas valides ...'
            })
        }
    })
    .catch(error => {
        console.log('Erreur obtenue : ' + error)
        res.status(400).json({ error })
    })
};


exports.signin = (req, res, next) => {
    console.log('Entre dans signin ...')
    userAdapter.getOne({ email: req.body.email })
    .then(user => {
        if(user.finded){
            bcryptjs.compare(req.body.password, user.user.password)
            .then(valid => {
                if(valid){
                    res.status(200).json({
                        state: 'SUCCESS',
                        userId: user.user.email,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })  
                } else {
                    console.log('Mot de passe incorrect !')
                    res.status(401).json({ state: ERROR, error: 'Mot de passe incorrect !' })
                }
                
            })
            .catch(error => res.status(500).json({ state: ERROR, error }))
        } else {
            res.status(401).json({ state: ERROR, error: 'Utilisateur introuvable !' })
        }
    })
    .catch(error => res.status(500).json({ state: ERROR, error }))
};


// TODO checker que c'est pas une nieme tentative
exports.findUserByEmail = (req, res, next) => {

    // TODO verifier l'entré
    userAdapter.getOne(req.body)
    .then(result => {
        if(result.user){
            // generation du code et le stocker dans la table
            const code = generateCode(10);
            codeValidatorAdapter.addOne({
                verificationType: 'email',
                identifier: req.body.email,
                code: code
            })
            .then(success => {
                console.log('emailCode: ' + code);

                // TODO envoyer un email chose qu on sait pas faire

                // envoyer la reponse au front
                res.status(200).json({
                    state: 'SUCCESS',
                    isFound: true                
                })
            })
            .catch(error => {
                console.log(error)
                res.status(400).json({ error })
            })
        } else {
            // utilisateur non trouve
            res.status(200).json({
                state: 'SUCCESS',
                isFound: false                
            })
        }
    })
    .catch(error => {
        console.log("findUserByEmail : ERROR -> Impossible de recuperer l'email à chercher")
        console.log(error)
        res.status(500).json({ error })
    })
}

exports.checkEmail = (req, res, next) => {
    console.log('identifier = ' + req.body.email)
    codeValidatorAdapter.updateOne({
        verificationType: 'email',
        identifier: req.body.email,
        code: req.body.code
    },{
        checked: true
    })
    .then(() => {
        res.status(200).json({
            state: 'SUCCESS'
        })
    })
    .catch(error => {
        console.log(error)
        res.status(400).json({ error })
    })

}

// req : { body : { email, newPwd } }
exports.changePwd = (req, res, next) => {
    codeValidatorAdapter.findOne({
        verificationType: 'email',
        identifier: req.body.email,
        checked: true
    })
    .then(found => {
        console.log('found:')
        console.log(found)

        // modifier pwd
        if(found.doc){
            // modification
            userAdapter.updateOne({
                email: req.body.email
            },{
                password: req.body.newPwd
            })
            .then(() => {
                // supprimer de la baqse codeValidator
                codeValidatorAdapter.deleteOne({
                    verificationType: 'email',
                    identifier: req.body.email
                })
                .catch(() => {
                    //TODO: admin notification
                    console.log('WARNING : Echec lors de la suppression de l\'utilisateur dans la table codeValidator')
                })
                res.status(200).json({
                    state: 'SUCCESS'
                })
            })   
        } else {
            // cas ou le mdp n'a pas ete trouve
            res.status(200).json({
                state: 'ERROR'
            })
        }
    })            
    .catch(error => {
        console.log(error)
        res.status(400).json({ error })
    })
}
    