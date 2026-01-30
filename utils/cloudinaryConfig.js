/**
 * Configuración de Cloudinary para upload de imágenes
 * 
 * TODO: Configurar con las credenciales reales
 * 
 * Para usar Cloudinary:
 * 1. Instalar: npm install cloudinary multer
 * 2. Agregar variables de entorno en .env:
 *    CLOUDINARY_CLOUD_NAME=tu_cloud_name
 *    CLOUDINARY_API_KEY=tu_api_key
 *    CLOUDINARY_API_SECRET=tu_api_secret
 *    CLOUDINARY_FOLDER_IES=anuies-tecnm/ies
 * 3. Descomentar el código siguiente
 */

// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// /**
//  * Sube una imagen a Cloudinary
//  * @param {Buffer|String} file - Archivo o path de la imagen
//  * @param {String} folder - Carpeta en Cloudinary
//  * @param {Object} options - Opciones adicionales
//  * @returns {Promise} Resultado del upload
//  */
// exports.uploadImage = async (file, folder = 'anuies-tecnm/ies', options = {}) => {
//   try {
//     const defaultOptions = {
//       folder: folder,
//       resource_type: 'image',
//       allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
//       transformation: [
//         { quality: 'auto' },
//         { fetch_format: 'auto' }
//       ],
//       ...options
//     };

//     const result = await cloudinary.uploader.upload(file, defaultOptions);
    
//     return {
//       url: result.secure_url,
//       publicId: result.public_id,
//       width: result.width,
//       height: result.height,
//       format: result.format
//     };
//   } catch (error) {
//     throw new Error(`Error al subir imagen a Cloudinary: ${error.message}`);
//   }
// };

// /**
//  * Elimina una imagen de Cloudinary
//  * @param {String} publicId - ID público de la imagen
//  * @returns {Promise}
//  */
// exports.deleteImage = async (publicId) => {
//   try {
//     return await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     throw new Error(`Error al eliminar imagen de Cloudinary: ${error.message}`);
//   }
// };

// /**
//  * Upload específico para logos
//  */
// exports.uploadLogo = async (file) => {
//   return await exports.uploadImage(file, 'anuies-tecnm/ies/logos', {
//     transformation: [
//       { width: 500, height: 500, crop: 'limit' },
//       { quality: 'auto' }
//     ]
//   });
// };

// /**
//  * Upload específico para banners
//  */
// exports.uploadBanner = async (file) => {
//   return await exports.uploadImage(file, 'anuies-tecnm/ies/banners', {
//     transformation: [
//       { width: 1920, height: 600, crop: 'limit' },
//       { quality: 'auto' }
//     ]
//   });
// };

// /**
//  * Upload específico para galería
//  */
// exports.uploadGalleryImage = async (file) => {
//   return await exports.uploadImage(file, 'anuies-tecnm/ies/gallery', {
//     transformation: [
//       { width: 1200, crop: 'limit' },
//       { quality: 'auto' }
//     ]
//   });
// };

// module.exports = exports;

/**
 * Placeholder temporal - devuelve error hasta que se configure
 */
module.exports = {
  uploadImage: async () => {
    throw new Error('Cloudinary no configurado. Agrega las credenciales en .env');
  },
  deleteImage: async () => {
    throw new Error('Cloudinary no configurado. Agrega las credenciales en .env');
  },
  uploadLogo: async () => {
    throw new Error('Cloudinary no configurado. Agrega las credenciales en .env');
  },
  uploadBanner: async () => {
    throw new Error('Cloudinary no configurado. Agrega las credenciales en .env');
  },
  uploadGalleryImage: async () => {
    throw new Error('Cloudinary no configurado. Agrega las credenciales en .env');
  }
};
