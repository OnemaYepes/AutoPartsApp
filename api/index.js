const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js')
const OTPModel = require('./models/OTP.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true,
  //origin: 'http://192.168.20.15:5173',
  origin: true,
}));


mongoose.connect(process.env.MONGO_URL)

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/test', (req,res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    
    res.json(userDoc);

  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
          email:userDoc.email,
          id:userDoc._id},
          jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, { 
          httpOnly: true, 
          secure: true, 
          sameSite: 'None' 
        }).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { 
    httpOnly: true,   
    secure: true,     
    sameSite: 'None',
    expires: new Date(0) 
  }).json({ success: true });
});

app.post('/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' +newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: 'uploads/' });

app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path: tempPath, originalname } = req.files[i];
    const ext = originalname.split('.').pop();
    const newPath = `${tempPath}.${ext}`;

    fs.renameSync(tempPath, newPath);

    uploadedFiles.push(path.basename(newPath));
  }

  console.log(uploadedFiles);
  res.json(uploadedFiles);
});

app.post('/places', (req,res ) => {
  const {token} = req.cookies;
  const {title,address,addedPhotos,description,price, perks,extraInfo,checkIn,checkOut,maxGuests} = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,address,photos:addedPhotos,description,
      price,perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});


app.get('/user-places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}));
  });
});

app.get('/places/:id', async (req,res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/places', async (req, res) => {
  res.json(await Place.find() );
})

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

app.get('/bookings', async (req,res) => {
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

   
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos 
    await OTPModel.updateOne({ email }, { otp, expiry }, { upsert: true });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tu código de recuperación de contraseña',
      html: `<p>Tu código de recuperación de contraseña es: <strong>${otp}</strong>. Este código expirará en 5 minutos.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    res.json({ message: 'Código de recuperación enviado a tu correo electrónico' });

  } catch (error) {
    console.error('Error en /forgot-password:', error); 
    if (error.code === 'EENVELOPE' || error.responseCode === 550) {
       return res.status(500).json({ message: 'Error al enviar el código de recuperación. Verifica la dirección de correo.' });
    } else if (error.name === 'MongoNetworkError') {
       return res.status(500).json({ message: 'Error de base de datos.' });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const otpRecord = await OTPModel.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({ message: 'Código OTP inválido o expirado' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, bcryptSalt);

  user.password = hashedPassword;
  await user.save();

  await OTPModel.deleteOne({ email });

  res.json({ message: 'Contraseña restablecida exitosamente' });
});

app.listen(4000, '0.0.0.0', () => {
  console.log('Servidor corriendo en el puerto 4000');
});

