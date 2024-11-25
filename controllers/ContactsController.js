import User from "../models/UserModel.js";




export const Search = async (req, res, next) => {
  
    try {

        const {searchTerm} = req.body

        if(!searchTerm) {
           return res.status(400).json({
            message:"Search term is required!"
           }) 
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,"\\$&"
        )

        const regex = new RegExp(sanitizedSearchTerm, "i")

        const contacts = await User.find({
            $and: [
            {_id: {$ne:req.userId}}, 
            {$or:[{firstName: regex}, {lastName:regex}, {email:regex}]}
        ]
    })

     return res.status(200).json({
        contacts
     })
    } catch (err) {
      console.log("this is err:", err);
      return res.status(500).send("Internal server error");
    }
  };
  