const request = require("request");
const userRoute = require("../src/app");
const userService = require("../src/service/userService");
const baseUrl = "http://localhost:4000/user";

const userDetailLogin = {
  detailOne: {
    contactNo: 708980608,
    password: "Sid@476"
  },
  detailTwo: {
    contactNo: 9098765432,
    password: "Abc@1234"
  },
  detailThree: {
    contactNo: 9098765432,
    password: "Abc@123"
  }
}

const userDetailRegister = {
  detailOne: {
    bookings: [
      "B1001",
      "B1002"
    ],
    userId: "U1001",
    name: "abc",
    emailId: "abc@gmail.com",
    contactNo: 9098765432,
    password: "Abc@1234"
  },
  detailTwo: {
    userId: "U1003",
    name: "Sarita",
    emailId: "sarita@gmail.com",
    contactNo: 9827390127,
    password: "Sarita@0110"
  }
}

describe("TestCase Set 1: Set User Db", () => {
  it("TestCase 1: Returns status code 200", (done) => {
    request.get(baseUrl + "/setup", (error, response, body) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });
  it("TestCase 2: Returns Inserted Successfully", (done) => {
    request.get(baseUrl + "/setup", (error, response, body) => {
      expect(body).toBe("Insertion Successfull");
      done();
    });
  });
});

describe("TestCase Set 2: Login", () => {
  it("TestCase 1: Invalid Contact Input", (done) => {
    userService.login(userDetailLogin.detailOne.contactNo, userDetailLogin.detailOne.password).catch(data => {
      expect(data.status).toBe(404);    //Status for unregisterd number
      expect(data.message).toBe("Enter registered contact number! If not registered, please register");
      done();
    });
  });
  it("TestCase 2: Invalid Password Input", (done) => {
    userService.login(userDetailLogin.detailThree.contactNo, userDetailLogin.detailThree.password).catch(data => {
      expect(data.status).toBe(406);    //Status for wrong password 406
      expect(data.message).toBe("Incorrect password");
      done();
    });
  });
  it("TestCase 3: Valid User Input", (done) => {
    userService.login(userDetailLogin.detailTwo.contactNo, userDetailLogin.detailTwo.password).then(data => {
      expect(data).toBeTruthy();      //Since we are getting output 
      done();
    });
  });
});

describe("TestCase Set 3: Register", () => {
  it("TestCase 1: Already Registerd Contact No.", (done) => {
    userService.register(userDetailRegister.detailOne).catch(error => {
      expect(error.status).toBe(404);   //Status of is 404
      expect(error.message).toBe("Contact number already exist!! Please change the number and try again.");
      done();
    });
  });
  it("TestCase 2: New Registration", (done) => {            //Will create new document
    userService.register(userDetailRegister.detailTwo).then(data => {
      expect(data).toBe("Registration successfull");
      done();
    })
  });
});