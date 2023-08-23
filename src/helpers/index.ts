import crypto from 'crypto';

const SECRET = 'NODE-DEMO-REST-API';


//The authentication method is a function that performs a cryptographic operation to hash the user's password along with a salt using the SHA-256 hashing algorithm. 
//1. The createHmac method is called from the crypto module, which is a built-in module in Node.js used for cryptographic operations. It is used to create a HMAC (Hash-based Message Authentication Code) instance.
//2. The createHmac method is called with the following arguments:
// 'sha256': The hashing algorithm to be used, in this case, SHA-256, which is a widely used and secure cryptographic hash function.
// [salt, password].join('/'): The data to be hashed. The salt and password are concatenated using the '/' separator before hashing. 
// The purpose of using a salt is to add additional randomness to the hash, making it more resistant to attacks like rainbow tables.
// 3.  The purpose of using a secret key in the HMAC process is to provide an additional layer of security and to ensure that only users with access to the secret key can generate the same hash value for a given input.
//4. The digest method is called to obtain the final hash value in hexadecimal format.
export const authentication = (salt: string, password: string): string => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

// crypto.randomBytes(128): This part of the code calls the randomBytes() function from the crypto module. 
// The function generates a specified number of cryptographically secure random bytes. In this case, it generates 128 random bytes.
// .toString('base64'): After generating the random bytes, the toString() method is called on the byte sequence. 
// The 'base64' argument specifies that the bytes should be encoded in Base64 format. 
// Base64 encoding converts binary data into a text representation, making it suitable for transmission or storage 
//in text-based formats like JSON or XML.
export const random = () => crypto.randomBytes(128).toString('base64');