const express = require('express')
const isAdminUser = require('../middlewares/admin-middleware')
const authMiddleware = require('../middlewares/auth-middleware')
const uploadMiddleware = require('../middlewares/upload-middleware')
const { uploadImage,fetchImagesController, deleteImageController } = require('../controllers/storage-controller')

const router = express.Router()

//upload the image
router.post('/upload', authMiddleware, isAdminUser, uploadMiddleware.single('image'),uploadImage)

//fetch images
router.get('/images', authMiddleware, fetchImagesController )


//delete image
router.delete('/:id',authMiddleware, isAdminUser, deleteImageController)

module.exports = router