const chai = require('chai')
const Server= require('./index')
const chaiHTTP=require('chai-http')
const { expect } = require('chai')

chai.should()
chai.use(chaiHTTP)

describe('Booking Api',()=>{

      //test cases for get all bookings  API

    describe('/get-all-bookings',()=>{
        it('it should return all the tasks',(done)=>{
            chai.request(Server)
            .get('/get-all-bookings')
            .end((req,res) =>{

                res.should.have.status(201);
                 res.body.should.be.a('object');
                done()

            })
        })

 
    })

    //test cases for vehicle registeration API

    describe('POST /vehileRegister',()=>{
        it('it should create',(done)=>{
            const vehicle = {
                
               name:"BMW clx100",
               Type:"xuv"
            }
            chai.request(Server)
            .post('/vehileRegister')
            .send(vehicle)
            .end((req,res)=>{
                res.should.have.status(201)
                res.body.should.have.property('name').equal('BMW clx100')
                done()
            })
        })
    })

    //test cases for creat  booking  API
    describe('POST /create-booking',()=>{
        it('it should create booking',(done)=>{
            const bookings = {
                
                Fname:"saqlane",
                Lname: "khan",
                Phone: 8904571726,
                EmailId:"saqlanekhan@gmail.com",
                vehicle_type: "SUV XL",
                From_address: "tiptur",
                To_address: "TUmkur",
                booking_date:"31-01-2022",
                booking_time: "12pm",
                passenger_count:50
            }
            chai.request(Server)
            .post('/create-booking')
            .send(bookings)
            .end((req,res)=>{
                res.should.have.status(201)
                 res.body.should.have.property('Fname').equal('saqlane')
                done()
            })
        })
    })




})





