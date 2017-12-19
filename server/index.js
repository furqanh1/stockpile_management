let express = require('express')
let router = express.Router()
let paginate = require('express-paginate');

router.get('/', (req, res) => {
  res.json({
    version: '1.0'
  })
})

router.use('/auth', require('./auth'))
router.use('/account', require('./account'))
router.use(paginate.middleware(10, 50));


let loadCompany = require('../middlewares/loadCompany')
let verifyAdmin = require('../middlewares/verifyAdmin')

let passport = require('passport')
router.use(passport.authenticate('jwt', { session: false }))

router.use('/admin', verifyAdmin, require('./sites'))

// router.use('/admin', verifyAdmin, require('./sites'))

router.use('/admin', verifyAdmin, require('./company'))

router.use('/admin', verifyAdmin, require('./users'))

router.use('/sites', loadCompany, require('./sites'))

// router.use('/sites', loadCompany, require('./sites'))

router.use('/levels', loadCompany, require('./levels'))

// router.use('/adminSites', loadCompany, require('./sites'))

router.use('/users', loadCompany, require('./users'))

router.use('/company', loadCompany, require('./company'))
router.use('/reports', loadCompany, require('./reports'))

router.use(require('../errors').middleware)

module.exports = router
