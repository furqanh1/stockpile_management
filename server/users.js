let express = require('express')
let router = express.Router()
const bcrypt = require('bcryptjs')


const { User, Site, Role, UserRole, UserSite, LoginHistory, Company, Report } = require('../../../../models')
const { ResourceNotFound } = require('../errors')
const { toUser, toTech } = require('../serializers')

router.get('/:offset/:limit', (req, res, next) => {
  User.findAndCountAll({
    include: [LoginHistory, Company],
    order: [ ['id', 'DESC'] ],
    limit: req.params.limit,
    offset: req.params.offset,
  })
    .then(users => {
    res.send({
      success: true,
      data: users.rows.map(toUser),
      count: users.count
    })
  }).catch(next)
})

router.get('/count', (req, res, next) => {
  User.count(
  {
    where: {
      isDeleted: false
    }
  }).then(users => {
    res.send({
      success: true,
      data: users
    })
  }).catch(next)
})


router.post('/', (req, res, next) => {
  const passwordHash = bcrypt.hashSync('abc123', 10)
  User.upsert({
    email: req.body.email,
    name: req.body.name,
    passwordHash: passwordHash,
    CompanyId: parseInt(req.body.CompanyId)
  })
})

router.get('/search/:query/:limit/:offset', async (req, res, next) => {
  User.findAndCountAll({
    where: {
      isDeleted: false,
      $or: [{
        email: {
          $like: '%' + req.params.query + '%'
        }
      }, {
        name: {
            $ilike: '%' + req.params.query + '%'
        }
      }]
    },
    order: [ ['id', 'DESC'] ],
    include: [LoginHistory, Company],
    limit: req.params.limit,
    offset: req.params.offset,
  })
  .then(users => {
    res.send({
      success: true,
      data: users.rows.map(toUser),
      count: users.count
    })
  }).catch(next)
})

router.put('/edit', async (req, res, next) => {
  let data = req.body
  let r = data.userLevels, s = data.otherSites
  let passwordHash = '', passwordField = ''
  if (data.password) {
    passwordField = 'passwordHash'
    passwordHash = bcrypt.hashSync(data.password, 10)
  }
  user = await User.find({where: { id: data.userId  }})
  if (r != -1) userRole = await UserRole.destroy({where: {UserId:data.userId}})
  if (s != -1) userSite = await UserSite.destroy({where: {UserId:data.userId}})
  user.updateAttributes({
    name: data.name,
    restrictUser: data.restrictUser,
    isDeleted: data.isDeleted,
    [passwordField]: passwordHash,
  }).then(user => {
    for (var i = 0; i < r.length; i++) {
      Role.findOne({ where: { id: r[i].value } })
      .then(role => { user.setRoles(role) })
    }
    for (var j = 0; j < s.length; j++) {
      Site.findOne({ where: { id: s[j].value } })
      .then(site => { user.setSites(site) })
    }
  }).catch(err =>  console.log('edit user err',err))
})

router.get('/users/:userID/userSitesRoles', (req, res, next) => {
  let userId = req.params.userID
  User.findOne({
    where: {id: userId},
    include: [{ model:Site, include: [Company]}, Role, LoginHistory, Company]
  })
  .then(users => {
    res.send({
      success: true,
      data: toUser(users)
    })
  }).catch(next)

})

router.get('/techs', (req, res, next) => {
  User.findAll({
    where: {
      IsTech: true
    }
  }).then(techs => {
      res.send({
        success: true,
        data: techs.map(toTech)
      })
  }).catch(err => {
    console.log(err)
  })
})



module.exports = router
