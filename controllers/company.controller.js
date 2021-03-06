const Company = require('../models/company');
const moment = require('moment');
const {
    check,
    validationResult
} = require('express-validator/check');

let listAllCompanies = function (req, res, next) {
    console.log(req.hostname);
    Company.find({}).sort({
        created_at: -1
    }).then(function (company_list) {
        var comp_list = [];
        company_list.forEach(function (comp) {
            var temp_obj = {};
            temp_obj['id'] = comp._id;
            temp_obj['first_name'] = comp.first_name;
            temp_obj['last_name'] = comp.last_name;
            temp_obj['email'] = comp.email;
            temp_obj['company_name'] = comp.company_name;
            temp_obj['license_start_date'] = moment(comp.license_start_date).format('MMMM Do YYYY');
            temp_obj['license_end_date'] = moment(comp.license_end_date).format('MMMM Do YYYY');
            temp_obj['license_status'] = comp.license_status;
            comp_list.push(temp_obj);
        });
        res.render('pages/company_list', {
            compnay: comp_list
        });
    }).catch(next);
}

let showRegister = function (req, res, next) {
    res.render('pages/register', {
        success: '',
        errors: ''
    });
}

let validateCompany = [
    check('first_name').not().isEmpty().withMessage('First name is required.'),
    check('last_name').not().isEmpty().withMessage('Last name is required.'),
    check('email').not().isEmpty().withMessage('Email is required.'),
    check('email').isEmail().withMessage('Email is not valid.'),
    check('company_name').not().isEmpty().withMessage('Company name is required.'),
    check('license_start_date').not().isEmpty().withMessage('License start date is required.'),
    check('license_start_date').isISO8601().withMessage('Invalid start date.'),
    check('license_end_date').not().isEmpty().withMessage('License end date is required.'),
    check('license_end_date').isISO8601().withMessage('Invalid end date.'),
    check('company_name').custom(value => {
        return Company.findOne({
            company_name: value
        }).then(comp => {
            if (comp) {
                return Promise.reject('This company is already registered');
            }
        });
    })
];

let registerCompany = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('pages/register', {
            success: '',
            errors: errors.array()
        });
    }

    /* Date validation using moment.js */
    if (moment(req.body.license_end_date).isBefore(moment(req.body.license_start_date))) {
        return res.render('pages/register', {
            errors: [{
                msg: 'License end date must be less than start date.'
            }],
            success: ''
        });
    }

    Company.create(req.body).then(function () {
        res.render('pages/register', {
            errors: '',
            success: 'Company successfuly created!'
        });
    }).catch(next);
}

let editCompany = function (req, res, next) {
    Company.findOne({
        _id: req.params.id
    }).then(function (comp) {
        res.render('pages/edit', {
            company: {
                id: comp._id,
                license_status: comp.license_status,
                first_name: comp.first_name,
                last_name: comp.last_name,
                email: comp.email,
                company_name: comp.company_name,
                license_start_date: moment(comp.license_start_date).format('YYYY-MM-DD'),
                license_end_date: moment(comp.license_end_date).format('YYYY-MM-DD')
            },
            success: req.flash('success'),
            errors: req.flash('errors')
        });
    }).catch(next);
}

let updateDate = function (req, res, next) {
    /* Date validation using moment.js */
    if (!(moment(req.body.license_start_date, 'YYYY-MM-DD', true).isValid())) {
        req.flash('errors', 'License start date is not valid.');
        return res.redirect('edit/' + req.body.id);
    } else if (!(moment(req.body.license_end_date, 'YYYY-MM-DD', true).isValid())) {
        req.flash('errors', 'License end date is not valid.');
        return res.redirect('edit/' + req.body.id);
    } else if (moment(req.body.license_end_date).isBefore(moment(req.body.license_start_date))) {
        req.flash('errors', 'License end date must be less than start date.');
        return res.redirect('edit/' + req.body.id);
    }

    Company.findById(req.body.id, function (err, company) {
        if (err) {
            next(err);
        }
        company.license_start_date = req.body.license_start_date;
        company.license_end_date = req.body.license_end_date;
        company.save(function (err, comp) {
            if (err) {
                next(err);
            }
            res.render('pages/edit', {
                company: {
                    id: comp._id,
                    license_status: comp.license_status,
                    first_name: comp.first_name,
                    last_name: comp.last_name,
                    email: comp.email,
                    company_name: comp.company_name,
                    license_start_date: moment(comp.license_start_date).format('YYYY-MM-DD'),
                    license_end_date: moment(comp.license_end_date).format('YYYY-MM-DD')
                },
                errors: '',
                success: 'Company successfuly updated!'
            });
        });
    });
}

let fetchCompany = function (req, res, next) {
    Company.findOne({
        company_name: req.params.comp_name
    }).then(function (company) {
        if (company) {
            if (company.license_status) {
                res.status(200).send('Success');
            } else if (!company.license_status) {
                res.status(200).send('false');
            }
        } else {
            res.status(422).send({
                message: 'Company not found'
            });
        }
    }).catch(next);
}

let updateCompany = function (req, res, next) {
    Company.findByIdAndUpdate({
        _id: req.params.id
    }, req.body).then(function () {
        Company.findOne({
            _id: req.params.id
        }).then(function (company) {
            res.send(company);
        });
    }).catch(next);
}

module.exports = {
    listAllCompanies,
    validateCompany,
    showRegister,
    registerCompany,
    editCompany,
    updateDate,
    updateCompany,
    fetchCompany
}