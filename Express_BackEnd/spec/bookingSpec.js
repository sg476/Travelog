const request = require("request");
const baseUrl = "http://localhost:4000/booking";
const bookingService = require("../src/service/bookingService")

describe("TestCase Set 1: Set Booking Db", () => {
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
