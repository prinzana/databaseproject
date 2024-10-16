const path = require('path');
const fs = require('fs');
const db = require('../config/database'); // Include your database configuration

// Fetch profile data from the database
exports.fetchProfile = async (userId) => {
    try {
        // Fetch user profile from the database
        const userProfile = await db.User.findById(userId); // Example using Mongoose
        
        if (!userProfile) {
            throw new Error('User not found');
        }

        return {
            fullName: userProfile.fullName,
            community: userProfile.community,
            clan: userProfile.clan,
            familyName: userProfile.familyName,
            stateOfResidence: userProfile.stateOfResidence,
            address: userProfile.address,
            occupation: userProfile.occupation,
            sex: userProfile.sex,
            maritalStatus: userProfile.maritalStatus,
            numberOfChildren: userProfile.numberOfChildren,
            email: userProfile.email,
            dob: userProfile.dob,
            lgaOfResidence: userProfile.lgaOfResidence,
            profilePictureUrl: userProfile.profilePictureUrl // Include the profile picture URL
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Failed to fetch profile data');
    }
};

// Update profile data in the database
exports.updateProfile = async (userId, updatedData) => {
    try {
        const updatedProfile = await db.User.findByIdAndUpdate(userId, updatedData, { new: true }); // Example using Mongoose
        
        if (!updatedProfile) {
            throw new Error('Profile update failed');
        }

        return updatedProfile; // Return updated data from the DB
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile data');
    }
};

// Handle profile picture upload and save to the server
exports.uploadProfilePicture = async (userId, file) => {
    try {
        const uploadPath = path.join(__dirname, '..', 'uploads', `${userId}-${file.name}`);
        
        // Move the file to the uploads folder
        await file.mv(uploadPath);

        // Save the file path in the database under the user's profile
        const updatedProfile = await db.User.findByIdAndUpdate(
            userId,
            { profilePictureUrl: `/uploads/${userId}-${file.name}` },
            { new: true }
        ); // Example using Mongoose

        if (!updatedProfile) {
            throw new Error('Failed to update profile picture');
        }

        return updatedProfile; // Return updated data from the DB
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw new Error('Failed to upload profile picture');
    }
};
