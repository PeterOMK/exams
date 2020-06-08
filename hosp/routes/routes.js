const router = require('express').Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/goodhealthDb", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});

//Using bodyparser and multer middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));
//Using cookie and session middleware
router.use(cookieParser());
router.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
);
router.use(upload.array());

//declaring schema for Admin Model
var adminSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }
})

//declaring schema for patient model
var patientSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    contactPhone: {
        type: String
    },
    residentialAddress: {
        type: String
    },
    emergencyContact: {
        type: String
    }
});

//Declaring schema for Payment Model
var paymentSchema = mongoose.Schema({
    fullName: {
        type: String,
    },
    paymentDate: {
        type: Date,
    },
    amount: {
        type: Number,
    },
    balance: {
        type: Number,
    }
});

//Model for Admni
var admin = mongoose.model("admin", adminSchema);
var patient = mongoose.model("patient", patientSchema);
var payment = mongoose.model("payment", paymentSchema);


//Route To Render Home Page
router.get('/', (req, res) => {
    res.render('home.ejs');
})

//Route To Render Sign Up Page
router.get('/admin/signup', (req, res) => {
    res.render('signup.ejs');
})

//Route To Render DashBoard
router.get('/admin/dashboard', (req, res) => {
    res.render('dashboard.ejs');
})

//Route To Render New Patient
router.get('/admin/dashboard/newPatient', (req, res) => {
    res.render('newPatient.ejs')
})

//Route render Payment Form
router.get('/admin/dashboard/payment', (req, res) => {
    res.render('payment.ejs')
})

//Route To Render All Patients Page
router.get('/admin/dashboard/viewAllPatients', (req, res) => {
    patient.find({}).then((patients) => {
        res.render('allPatients.ejs', {
            patient: patients
        });
    }).catch((err) => {
        res.send(err);
    })
})
//Route To Handle Post Request On Register Page
router.post('/admin/signup', (req, res) => {
    if (req.body.password === req.body.confirmPassword) {
        var newAdmin = new admin({
            email: req.body.email,
            password: req.body.password
        })
        newAdmin.save((err, done) => {
            if (err) {
                throw err;
            } else {
                res.redirect('/')
            }
        });
    }
});

//Route To Render Post Request On Login Page
router.post('/', (req, res) => {
    admin.findOne({
        email: req.body.email
    }, (err, result) => {
        if (req.body.password === result.password) {
            res.redirect('/admin/dashboard');
        }
    })
})


//Route To Handle Post Request on New Patient Form
router.post('/admin/dashboard/newPatient', (req, res) => {
    var newPatient = new patient({
        fullName: req.body.fullName,
        dateOfBirth: req.body.dateOfBirth,
        contactPhone: req.body.contactPhone,
        residentialAddress: req.body.residentialAddress,
        emergencyContact: req.body.emergencyContact
    });

    newPatient.save((err, done) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/admin/dashboard/payment');
        }
    });
})

//Route To Handle Post Request On Payment Page
router.post('/admin/dashboard/payment', (req, res) => {
    var newPayment = new payment({
        fullName: req.body.fullName,
        paymentDate: req.body.paymentDate,
        amount: req.body.amount,
        balance: req.body.balance
    });

    newPayment.save((err, done) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/admin/dashboard');
        }
    })
})
//Router To delete A patient
router.get('/:id', (req, res) => {
    patient.remove({
            _id: req.params.id
        })
        .then((done) => {
            res.redirect("/admin/dashboard/viewAllPatients");
        })
        .catch((err) => {
            res.json(err);
        });
})
//Route To Handle Post Request On Logout Page
router.post('/logout', (req, res) => {
    res.redirect('/')
})
module.exports = router;