/**
 * QR Code Generator Utility
 * Generates QR codes for artworks and uploads to Cloudinary
 */

const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');

/**
 * Generate QR code image for an artwork
 * @param {string} artworkId - MongoDB ObjectId of the artwork
 * @returns {Promise<string>} - Cloudinary secure URL of the QR code image
 */
async function generateQRCode(artworkId) {
  try {
    if (!artworkId) {
      throw new Error('Artwork ID is required');
    }

    // Create QR code data: embed full URL to artwork detail page
    // Format: {FRONTEND_URL}/artwork/{artworkId}
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrData = `${frontendUrl}/artwork/${artworkId}`;

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H', // High error correction
      type: 'image/png',
      width: 300, // Size: 300x300px
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Convert data URL to buffer
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'artworks/qrcodes',
          resource_type: 'image',
          public_id: `qr_${artworkId}`,
          tags: ['qrcode', artworkId],
          overwrite: true // Overwrite if exists
        },
        (err, result) => {
          if (err) {
            console.error('QR Code upload error:', err);
            reject(err);
          } else {
            console.log(`✅ QR Code generated for artwork ${artworkId}`);
            resolve(result.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
}

/**
 * Generate QR codes for multiple artworks
 * @param {Array<string>} artworkIds - Array of artwork IDs
 * @returns {Promise<Object>} - Object with success/failure counts and details
 */
async function generateBulkQRCodes(artworkIds) {
  try {
    const results = {
      total: artworkIds.length,
      success: 0,
      failed: 0,
      details: []
    };

    for (const artworkId of artworkIds) {
      try {
        const qrUrl = await generateQRCode(artworkId);
        results.success++;
        results.details.push({
          artworkId,
          status: 'success',
          qrUrl
        });
      } catch (error) {
        results.failed++;
        results.details.push({
          artworkId,
          status: 'failed',
          error: error.message
        });
      }
    }

    console.log(`✅ Bulk QR generation complete: ${results.success}/${results.total} succeeded`);
    return results;
  } catch (error) {
    console.error('Bulk QR generation error:', error);
    throw error;
  }
}

module.exports = {
  generateQRCode,
  generateBulkQRCodes
};
