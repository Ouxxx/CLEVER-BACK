
// coucou modif
exports.touch = (req, res, next) => {
    console.log('Entree dans touch ...')
    res.status(201).json({ 
        state: "SUCCESS",
        message: 'Votre requête a bien été reçue !' 
    });
    console.log('Réponse envoyée avec succès !');
    next();
}