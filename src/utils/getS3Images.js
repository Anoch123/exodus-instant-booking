export const getS3Images = (table) => {
    if (table.images && table.images.length > 0) {
        // If images is a string, parse it
        const images = typeof table.images === 'string'
            ? JSON.parse(table.images)
            : table.images;
        return images[0];
    }
};