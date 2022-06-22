const express = require('express');
const res = require('express/lib/response');
const mongoose=require('mongoose');
const  cors = require('cors')
const bookings = require('./src/collection/bookings');
const customer = require('./src/collection/customer');

const Db=require('./src/db/mongoose')


const app = express()
const port = 3000;



app.use(express.json())
app.use(cors())

   

app.post('/create-booking',async(req,res)=>{
    const db=new Db(req.body);
    // console.log(req.body)

    try {
        const customer_info=await db.checkandInsertCustomer();
        const customer_id=customer_info._id;
        // console.log(customer_id)

        const vehicle_id=await db.getVehicale_id(); 
        const booking=await db.create_booking(vehicle_id,customer_id);

        let BookingDetails={
            booking_id:booking._id,
            Fname:customer_info.Fname,
            Lname:customer_info.Lname,
            Phone:customer_info.Phone,
            EmailId:customer_info.EmailId,
            customer_id:customer_id,
           vehicle_id:booking.vehicle_id,
           From_address:booking.From_address,
           To_address:booking.To_address,
           passenger_count:booking.passenger_count,
           booking_date:booking.booking_date,
           booking_time:booking.booking_time

        }

        // console.log(BookingDetails)
   res.status(201).send(BookingDetails)

        
    } catch (error) {
       res.status(500).send(error.message) 
    }





})


app.patch('/updateBooking/:id',async(req,res)=>{
    const updates=Object.keys(req.body)

    console.log(updates)
    

    const allowupdates =['Fname','Lname',       
    'Phone',       
    'EmailId',     
    'vehicle_type',
    'From_address',
    'To_address',  
    'booking_date',
    'booking_time',
    'passenger_count']

    const isvalidoperation = updates.every((update)=> allowupdates.includes(update))


    if(!isvalidoperation){
        return res.status(400).send("error while update")
    }
    try {
        // console.log(req.params.id,req.body)
    
        const bookingupdate = await bookings.findByIdAndUpdate(req.params.id,req.body,{new:true})
// console.log(bookingupdate)

// console.log(bookingupdate.customer_id)
        const customerdata = await customer.findByIdAndUpdate(bookingupdate.customer_id,req.body,{new:true})

        // console.log(customerdata)

        res.send({bookingupdate,customerdata})
        
    } catch (error) {
        res.status(500).send(error.message) 
    }
})



app.get('/get-all-bookings',async(req,res)=>{
    console.log(req.query)
let query;
    if(Object.keys(req.query).length>0){
         query=req.query
    
    }else{
        query={}
    }
  
const bookings=await Db.getALlBookings(query)



res.status(201).send({bookings})

})


app.post('/vehileRegister',async(req,res)=>{
    const db=new Db(req.body);
    const resp=await db.register_vehicle();
    res.status(201).send(resp)
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


module.exports=app


