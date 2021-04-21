import userStore from '../../../services/database-service/userStore.js';
import cryptoService from '../../crypto-util/crypto-service';
import authenticationService from '../../authentication-service/authentication-service';

  export async function postRegister(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    if (!username || !email || !password) {
      res.status(400).json({errorText: 'Request is incomplete'});
      return;
    }

    if (password.length < 8) {
      res.status(400).json({errorText: 'Password is shorter than 8 characters'});
      return;
    }

    if (await userStore.usernameDoesAlreadyExist(username)) {
      res.status(400).json({errorText: 'Username already exists'});
      return;
    }

    const hashedPassword = cryptoService.hashPassword(password);
    const createdUserId = await userStore.insertUser(username, hashedPassword, email);

    authenticationService.setJWTCookie(res, createdUserId);
    res.json({userID: createdUserId});
    return;
  }

  export async function postToken(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const passwordHash = cryptoService.hashPassword(password);

    const user = await userStore.getUserByUsername(username);
    if (!user) {
      res.status(400).json({errorText: 'A user with this username does not exist'});
    }
    if (passwordHash === user.passwordHash) {
        authenticationService.setJWTCookie(res, user.userID);
        res.json({userID: user.userID});
        return;
    } else {
      res.status(400).json({errorText: 'Invalid password'});
      return;
    }
  }

  export async function deleteToken(req, res) {
      authenticationService.removeJWTCookie(res);
      res.status(200).json({text: 'Deleted token'});
    return;
  }

