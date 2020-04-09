const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userFormAdapter = require('../adapters/userform');
const userAdapter = require('../adapters/user');

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
            .then(
                // supprimer l'utilisateur de la table de transition
                userFormAdapter.deleteOne(valid.user)
                .then(() => res.status(201).json({
                    state: 'SUCCESS', 
                    message:'Utilisateur créé'
                }))
                .catch(error => 
                    // TODO:  Il faut faire qch pour relancer la suppression
                    res.status(201).json({
                        state: 'SUCCESS', 
                        message:'Utilisateur créé'
                }))
            )
            .catch(error => res.status(400).json({ error }))

        } else {
            // Les codes sont pas bon
            res.status(404).json({
                state: 'ERROR', 
                message: 'Les codes de verifications ne sont pas valides ...'
            })
        }
    })
    .catch(error => res.status(400).json({ error }))
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
                        userId: user.user.email,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })  
                } else {
                    console.log('Mot de passe incorrect !')
                    res.status(401).json({ error: 'Mot de passe incorrect !' })
                }
                
            })
            .catch(error => res.status(500).json({ error }))
        } else {
            res.status(401).json({ error: 'Utilisateur introuvable !' })
        }
    })
    .catch(error => res.status(500).json({ error }))
};