import cloudinary from 'cloudinary';
cloudinary.config({
    cloud_name: 'dvstzyogy',
    api_key: '544918322574147',
    api_secret: 'WJv1374MZiWj1W-_zUMnxPAfir4',
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};

const uploadImage = async (image) => {
    console.log('Upload')
    //imgage = > base64
        await cloudinary.uploader.upload_large(image, opts)
        .then(res => {return res.json})
        .catch(err => {return err})
};

export default uploadImage