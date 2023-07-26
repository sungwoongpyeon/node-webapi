import mongoose from "mongoose";

// What is Entity?
// In the context of a database schema, an entity refers to a distinct and unique object or concept that is represented as a table 
// in a relational database or a document in a NoSQL database. 
// Entities are used to model real-world objects, such as people, products, orders, customers, etc., 
// and each entity typically corresponds to a single table or collection in the database.

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
      // In the above Mongoose query, the + symbol is used as a projection option to include specific fields 
      // that have been marked as "select: false" in the Mongoose schema. 
      // By default, Mongoose will exclude fields with "select: false" from the query results to prevent sensitive or unnecessary data from being exposed. 
      // However, by using the + symbol in the query, you can override this behavior and explicitly include the specified fields in the query result.
      // E.g. const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    },
});

// In this line of code, mongoose.model() is a method provided by Mongoose that is used to create a model based on the provided schema.
export const UserModel = mongoose.model('User', UserSchema);

// User Actions
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
// In TypeScript, Record<string, any> is a utility type that represents an object type with string keys and values of any type. 
// It is a flexible type that allows you to define functions or methods that can handle a wide range of object shapes and data types.

// const user = await createUser({
//   email,
//   username,
//   authentication: {
//     salt,
//     password: authentication(salt, password),
//   },
// });

// { email, username, authentication: { salt, password: authentication(salt, password) } }: 
// This is an object passed as an argument to the createUser function. Since the values parameter is of type Record<string, any>, 
// it can accept this object without any issues. The object has specific keys like email, username, and authentication, with their respective values.

// In the given code, the reason for transforming the user to an object using user.toObject() after saving it to the database is likely 
// to ensure that the returned value is a plain JavaScript object and not a Mongoose document.
// When you use new UserModel(values).save(), Mongoose returns a Mongoose document representing the saved user in the database. 
// Mongoose documents are enriched with various Mongoose-specific methods and properties that enable features like data validation, getters/setters, virtual fields, and more.
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);