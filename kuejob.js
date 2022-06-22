var kue = require('kue-scheduler');
const { queue } = require('kue/lib/queue/events');
var Queue = kue.createQueue();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Fleet').then(console.log('connected'))

 const bookings = require('./src/collection/bookings')

//create a job instance
var job = Queue
            .createJob('every')
            .attempts(3)
            .priority('normal');
            Queue.clear(function(err,res){
                console.log(res)
            })

//schedule it to run every 5 min 
Queue.every('120 seconds', job);





//somewhere process your scheduled jobs
Queue.process('every', function(job, done) {
  console.log("***********************************************************************************")
  var d = new Date();
  d.setMinutes(d.getMinutes()-5);
 

 bookings.find({createdAt: {$gte: d}}).lean().then(re=>console.log("New Bookings =",re)).catch(r=>console.log(r.message))

console.log("***********************************************************************************")
    done();
});




