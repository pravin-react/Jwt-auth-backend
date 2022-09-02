const JWT = require('jsonwebtoken');
const { users } = require('../usersData');

exports.SignUp = async (req, res) => {
  const { email, password } = req.body;

  let userData = await users.find((data) => data.email === email);
  console.log('user Data', userData);
  if (userData?.length)
    res.status(400).json({ status: 'Failed', Message: 'User Already Exists' });
  else {
    users.push({ email, password });
    console.log('users', users);
    const token = JWT.sign({ email }, 'q1w2e3r4t5y6u7i8o9p0', {
      expiresIn: '1m',
    });

    res.status(201).json({
      status: 'Success',
      data: token,
    });
  }
};

exports.Login = async (req, res) => {
  const { email } = req.body;
  let userData = await users.find((data) => data.email === email);
  console.log('user data', userData);
  if (!userData) {
    res.status(401).json({
      status: 'Failed',
      Message: 'No Users Found',
    });
  } else {
    const token = JWT.sign({ email }, 'q1w2e3r4t5y6u7i8o9p0', {
      expiresIn: '165s',
    });

    const refreshToken = JWT.sign({ email }, 'q1w2e3r4t5y6u7i8o9p0', {
      expiresIn: '110s',
    });

    res.status(200).json({ status: 'Success', token, refreshToken });
  }
};

exports.RefreshTokenHandler = (req, res) => {
  let refreshToken = req.headers['x-access-token'];
  let decode = JWT.decode(refreshToken);
  let { email, exp } = decode;
  console.log('decode exp', exp);
  if (Date.now() >= exp * 1000) {
    res.status(400).json({ status: 'Refresh token expired', useremail: email });
  } else if (email) {
    const token = JWT.sign({ email }, 'q1w2e3r4t5y6u7i8o9p0', {
      expiresIn: '115s',
    });

    const refreshToken = JWT.sign({ email }, 'q1w2e3r4t5y6u7i8o9p0', {
      expiresIn: '110s',
    });

    res.status(200).json({
      status: 'Success',
      data: { token, refreshToken },
    });
  } else {
    res.status(400).json({ status: 'failure', useremail: email });
  }
};

exports.checkAuth = (req, res, next) => {
  console.log(req.headers);
  const { TokenExpiredError } = JWT;
  const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {
      return res
        .status(401)
        .send({ message: 'Unauthorized! Access Token was expired!' });
    }
    return res.sendStatus(401).send({ message: 'Unauthorized!' });
  };
  console.log('hai inside');
  const token = req.headers['x-access-token'];
  console.log('tokens', token);
  if (!token) {
    res.status(400).json({
      errors: [{ msg: 'No Token Found' }],
    });
  } else {
    JWT.verify(token, 'q1w2e3r4t5y6u7i8o9p0', (err) => {
      if (err) {
        return catchError(err, res);
      }
      next();
    });
  }
};
