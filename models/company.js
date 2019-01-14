const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
    first_name: {
        type: String,
        required: [true, 'First name field is required']
    },
    last_name: {
        type: String,
        required: [true, 'Last name field is required']
    },
    email: {
        type: String,
        required: [true, 'Email field is required']
    },
    company_name: {
        type: String,
        required: [true, 'Company name field is required'],
        index: true,
        unique: true
    },
    license_start_date: {
        type: Date,
        required: [true, 'License start date field is required']
    },
    license_end_date: {
        type: Date,
        required: [true, 'License end date field is required']
    },
    license_status: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Company = mongoose.model('company', CompanySchema);

module.exports = Company;