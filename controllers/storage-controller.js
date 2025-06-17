    const Image = require('../models/Image')
    const {uploadToCloudinary} = require('../helper/cloudinaryHelper')
    const fs = require('fs')

    const uploadImage=  async(req,res)=> {
        try{
            //check if file is missing in request object

            if(!req.file){
                return res.status(500).json({
                    success: false,
                    message: 'File is required. Please upload an image'
                })
            }


            //store image's filename and uploaded user id
            const newlyUploadedImage = new Image({
                url: req.file.filename, // filename saved by multer
                uploadedBy: req.userInfo.id
            })

            //save to mongoDB
            await newlyUploadedImage.save()

            //send response
            res.status(200).json({
                success: true,
                message: 'Image is uploaded successfully',
                image: newlyUploadedImage
            })

        }catch(error){
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Something went wrong! Please Try again'
            })
            
        }
    }


    //fetch all the image

    const fetchImagesController = async(req,res)=> {

        try{

            console.log('Query............',req.query.sortOrder);
            
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) ||3;
            const skip = (page -1) * limit;

            const sortBy = req.query.sortBy || 'createdAt';
            const sortOrder = req.query.sortOrder === 'asc'? 1: -1;

            const totalImages = await Image.countDocuments();
            const totalPages = Math.ceil(totalImages/limit);

            const sortObj = {}
            sortObj[sortBy] = sortOrder

            //retrive all images data   
            const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
            if(images) {
                res.status(200).json({
                    success: true,
                    currentPage: page,
                    totalPages: totalPages,
                    totalImages: totalImages,
                    images: images 
                })
            }

        }catch(error){
            res.status(500).json({
                success: false,
                message: 'Something went wrong! Please Try again'
            })
        }
    }

    const deleteImageController = async(req, res) => {
        const getCurrentImageIdOfImageToBeDeleted = req.params.id;

        
        const userId = req.userInfo.id

        const image = await Image.findById(getCurrentImageIdOfImageToBeDeleted);

        if(!image) {
            res.status(404).json({
                success: false,
                message: 'Image is not found'
            })
        }

        //check image is uploaded by current user
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete image because you haven't uploaded this"
            })
        }


        // delete photo from upload folder
        const filePath = `upload/${image.url}`;
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({
                success: false,
                message: 'Error deleting file from upload folder'
            });
        }

        //delete from mongoDB
        await Image.findByIdAndDelete(getCurrentImageIdOfImageToBeDeleted)

        res.status(200).json({
            success: true,
            image: "Image is deleted successfully"
        })

        
    }

module.exports = {
    uploadImage,
    fetchImagesController,
    deleteImageController
}