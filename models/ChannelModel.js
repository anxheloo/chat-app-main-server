import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({

    name: {
        type: String,
        required:true
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:false
    }],
    admin: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true
    },
    messages: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Message",
        },
      ],

    createdAt:{
        type:Date,
        default: Date.now()
    },
   updatedAt:{
        type:Date,
        default: Date.now()
    },
});


channelSchema.pre("save", async function (next) {
    this.updatedAt = Date.now(); 
    next();
  });

  channelSchema.pre("findOneAndUpdate", async function (next) {
    this.set({updatedAt: Date.now()});
    next();
  });

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
