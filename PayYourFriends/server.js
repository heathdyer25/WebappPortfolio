// Import path module
const path = require('path');

// Import our Express dependency
const express = require('express');

// Create a new server instance
const app = express();

//Set handlebars view engine
app.set('view engine', 'hbs');
app.set('views', 'templates');

//Use urel encoding
app.use(express.urlencoded({ extended: true }));

// Constant refers to template folder 
const templatesPath = path.join(__dirname, 'templates');

//REWORK: Updated multer settings
// Add multer depdency
const multer = require('multer');
//Multer settings
const storage = multer.diskStorage({
    //Set destination for file
    destination: function(req, file, cb) {
        cb(null, './static/uploads/')
    },
    // Add data and extension
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage});


// Use static references
app.use(express.static('static'));

//Attach route for form
app.get('/', (req, res) => {
    res.sendFile(path.join(templatesPath, 'form.html'));
});

const validateForm = require('./src/validation');

//Handle if request is send to "/send"
app.post('/send', upload.single('sender-image'), (req, res) => {
    //back end validation here
    if (!validateForm(req.body, req.file)) {
        res.status(400).sendFile(path.join(templatesPath, 'error.html'));
    }
    else {
        let data = {
            body : req.body,
            file : req.file
        }
        res.render('success', {data: data});
    }
});

//Otherwise something went wrong
app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(templatesPath, 'error.html'));
});

// Port number we want to use on this server
const PORT = process.env.PYF_PORT;

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
