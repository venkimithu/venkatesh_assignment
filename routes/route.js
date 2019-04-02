const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

router.get('/', companyController.listAllCompanies);

router.get('/register', companyController.showRegister);

router.post('/register', companyController.validateCompany, companyController.registerCompany);

router.put('/:id', companyController.updateCompany);

router.get('/edit/:id', companyController.editCompany);

router.post('/edit', companyController.updateDate);

router.get('/api/:comp_name', companyController.fetchCompany);

module.exports = router;