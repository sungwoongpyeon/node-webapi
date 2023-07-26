import express from 'express';

import { getUserByEmail, createUser } from '../db/users';
import { authentication, random } from '../helpers';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);
    
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    // Setting a cookie with the authentication session token on the backend is a common practice in web applications for implementing user authentication 
    // and maintaining user sessions. Cookies are small pieces of data stored on the client-side (usually in the user's browser) 
    // that are sent back to the server with subsequent HTTP requests. 
    // They are often used to store user-related information, such as session tokens, user preferences, or authentication details. 
    // Here's why the backend sets a cookie with the authentication session token:

    // User Authentication: When a user successfully logs in or authenticates on the website, the server generates an authentication session token. 
    // This token is a unique identifier that represents the user's authenticated session on the server.

    // Session Management: Cookies are commonly used to manage user sessions. 
    // By setting a cookie with the authentication session token, the server can associate the user's session token with the user's browser. 
    // This allows the server to recognize the user and maintain their authenticated state across multiple requests without requiring the user to reauthenticate for each request.    
    res.cookie('NODE-DEMO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}