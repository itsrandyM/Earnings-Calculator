const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String, // Hash passwords using bcrypt
  mobilePhone: String,
  countryOfResidence: String,
  cohortYear: Number,
  parentFirstName: String,
  parentMiddleName: String,
  parentLastName: String,
  parentEmail: String,
  parentMobilePhone: String,
  incomes: [{ type: Schema.Types.ObjectId, ref: 'Income' }]
});


const User = mongoose.model('User', userSchema);
module.exports = User