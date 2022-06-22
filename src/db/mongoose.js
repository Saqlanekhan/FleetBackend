const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Fleet').then(console.log('connected'))


const vehicle=require("../collection/vehicle")
const customer=require("../collection/customer")
const bookings=require("../collection/bookings")

var moment = require('moment')
let now = moment();
console.log(now.format())


class Db{
constructor(requestDataObj){
this.requestData=requestDataObj
}

async checkandInsertCustomer(){
  let er;
  try {
    const EmailId=this.requestData.EmailId;
  const checkCustomer= await customer.findOne({"EmailId":EmailId});
if(checkCustomer!=null){
  return checkCustomer
}else{
  let myCxData={
    Fname:this.requestData.Fname,
  Lname:this.requestData.Lname,
  EmailId:this.requestData.EmailId,
  Phone:this.requestData.Phone
}
  const insertCustomer= await customer.create(myCxData);
return insertCustomer
}
  } catch (error) {
    er=error.message
  }
return er
}


async getVehicale_id(){
  let er;
  const vehicle_type=this.requestData.vehicle_type;
  try {
    const vehicle_id=await vehicle.findOne({"Type":vehicle_type});
    return vehicle_id._id;
  } catch (error) {
    er=error.message
  }
  return er;
}




async create_booking(vehicle_id,customer_id){
  let erMsg=""
  try{
    let d=now.format();
    console.log(d)
    const bookingData={
      
      vehicle_id:vehicle_id,
      customer_id:customer_id,
      From_address:this.requestData.From_address,
      To_address:this.requestData.To_address,
      passenger_count:this.requestData.passenger_count
    
    }
    const booking=await bookings.create(bookingData);
    return booking
  } catch(e){
    erMsg=e
  } 
  return {message:erMsg,er:1}
}

async register_vehicle(){
  const vehicleregisteration= await vehicle.create(this.requestData);
  
  // return "vehicle registered successfully"

  return vehicleregisteration
}








static  async getALlBookings(query){
             try {
                     console.log(query)
                     const getallbookings=await bookings.find(query).lean();
                     const dt=await helper(getallbookings);
                     return dt
                    } 
            catch (error) {
                         
                 }
             }




}

async function helper(booking){
 
                              return new Promise(async(resolve,reject)=>{
                              const customerID=booking.map((b)=>b.customer_id);
 
                              const customerDetails =await customer.find({_id:{$in:customerID}}).lean();
   
                              let bb=booking.map((bk)=>{
                              const cx=customerDetails.find((c)=>
                              (c._id).toString()==bk.customer_id.toString()
                               )

                              let obj= {...bk,...cx};
                              obj._id=bk._id

                              return obj
                          })
 
                        resolve(bb)
                      })
                 }

module.exports=Db
