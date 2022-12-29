const signupSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    password: { type: "string" },
    repassword: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
  },
  additionalProperties: false,
  required: ["firstName", "lastName", "password", "repassword", "email"],
};

/*
repassword:"schochet0205",
email:"ayschochet@gmail.com",
firstName:"Avraham",
lastName:"Schochet",
password:"schochet0205",
phone:"323232323232",
*/
module.exports = { signupSchema };
