/**
 * FoodShareAI - Secure Administrator Creation Script
 * =========================================================================
 * NOTICE: For deployment provisioning & local development administration only.
 * This script securely creates an ADMIN account outside of the public API.
 * Admin credentials must be supplied via environment variables.
 * =========================================================================
 */
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const connectDB = require('../config/db');
const { User } = require('../models');
const { hashPassword } = require('../utils/password');
const { ROLES } = require('../utils/constants');

const createAdminAccount = async () => {
  try {
    console.log('🔒 [Admin Provisioning] Starting administrator creation...');

    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ [Admin Provisioning] MongoDB not connected. Check MONGODB_URI.');
      process.exit(1);
    }

    const adminName = process.env.ADMIN_NAME || '[DEMO] System Administrator';
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePass123!';

    if (!adminEmail || !adminPassword) {
      console.error('❌ [Admin Provisioning] ADMIN_EMAIL and ADMIN_PASSWORD must be provided.');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`ℹ️  [Admin Provisioning] Admin with email "${adminEmail}" already exists. Updating role to ADMIN...`);
      existingAdmin.role = ROLES.ADMIN;
      existingAdmin.isActive = true;
      existingAdmin.passwordHash = await hashPassword(adminPassword);
      await existingAdmin.save();
      console.log(`✅ [Admin Provisioning] Admin account updated successfully! (ID: ${existingAdmin._id})`);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(adminPassword);

    const admin = await User.create({
      fullName: adminName,
      email: adminEmail,
      passwordHash: hashedPassword,
      role: ROLES.ADMIN,
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      profileCompleted: true,
    });

    console.log('==================================================');
    console.log('✅ [Admin Provisioning] Administrator created successfully!');
    console.log(`👤 Name:  ${admin.fullName}`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Role:  ${admin.role}`);
    console.log(`🆔 ID:    ${admin._id}`);
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Admin Provisioning] Error: ${error.message}`);
    process.exit(1);
  }
};

createAdminAccount();
